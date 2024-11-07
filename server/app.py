#!/usr/bin/env python3

# Standard library imports
# from datetime import datetime

# Remote library imports
from flask import request, make_response, abort
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Game, Store, Listing


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)
