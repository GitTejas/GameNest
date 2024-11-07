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


class Games(Resource):

    def get(self):
        games = [games.to_dict() for games in Game.query.all()]

        return make_response(games, 200)

    def post(self):
        pass

    def patch(self, id):
        pass

    def delete(self, id):
        pass

class GamesById(Resource):

    def get(self, id):
        game = Game.query.filter(Game.id == id).first()
        return make_response(game, 200)
    
    def patch(self, id):
        pass


class Stores(Resource):
    
    def get(self,):
        pass

    def post(self):
        pass

    def patch(self, id):
        pass

    def delete(self, id):
        pass

class StoresById(Resource):

    def get(self):
        pass
    
    def patch(self, id):
        pass


class Listings(Resource):
    
    def get(self):
        pass

    def post(self):
        pass

    def patch(self, id):
        pass

    def delete(self, id):
        pass


api.add_resource(Games, "/games")
api.add_resource(GamesById, "/games/<int:id>")
api.add_resource(Stores, "/stores")
api.add_resource(StoresById, "/stores/<int:id>")
api.add_resource(Listings, "/listings")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

