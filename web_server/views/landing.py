#!/usr/bin/env python3

from flask import render_template
from web_server.views import web_views


# Home page route
@web_views.route('/', strict_slashes=False)
def landing_page():
    return render_template('index.htm')

@web_views.route('/about', strict_slashes=False)
def about_page():
    return render_template('about.htm')

@web_views.route('/contacts', strict_slashes=False)
def contacts_page():
    return render_template('contact.html')

@web_views.route('/terms', strict_slashes=False)
def terms():
    return render_template('terms.htm')

@web_views.route('/privacy', strict_slashes=False)
def privacy():
    return render_template('privacy.htm')
