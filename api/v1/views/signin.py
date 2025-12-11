#!/usr/bin/env python3
""" Handle api interactions involving sign in"""
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash


def users_search(data=""):
    """
    Retrieves a user object with a certain username
    """
    if not data or not len(data): 
        return None

    all_users = storage.all(User).values()
    for user in all_users:
        if user.email == data:
            return user
    return None


@app_views.route('/login', methods=["POST"], strict_slashes=False)
def login_user():
    """
    Log in an existing user and return a JWT access token.
    Expects JSON data with 'email' and 'password'.
    """
    data = request.get_json()
    email = data.get("email", None)
    password = data.get("password", None)

    user = users_search(email)

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401
    # if (user.user_type != UserType.REGULAR):
        # return jsonify({"message": "Invalid email or password"}), 401

    # Create the access token for the logged-in user
    iden = user.to_dict()
    access_token = create_access_token(identity=iden)
    return jsonify(access_token=access_token), 200

@app_views.route("/dashboard", methods=["GET"])
@jwt_required()
def user_dashboard():
    """
    A protected route that requires a valid JWT access Token.
    Returns a personalized welcome message for the user
    """
    current_user = get_jwt_identity()
    current_user_name = current_user['name']
    return jsonify({
        "name": current_user_name,
        "all": current_user
    }), 200
