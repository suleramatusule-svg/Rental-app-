#!/usr/bin/env python3
""" Blue print for the web pages """
from flask import Blueprint


web_views = Blueprint('web_views', __name__)


from web_server.views.landing import *
