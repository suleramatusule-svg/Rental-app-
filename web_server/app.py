#!/usr/bin/env python3
""" Flask web server application
"""
from flask import Flask, render_template

app = Flask(__name__)


# Home page route
@app.route('/', strict_slashes=False)
def landing_page():
    return render_template('index.htm')



if __name__ == '__main__':
    """ run the function """
    app.run(host='0.0.0.0', port=5000, debug=True)
