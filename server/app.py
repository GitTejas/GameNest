#!/usr/bin/env python3

from flask import request, make_response, abort
from flask_restful import Resource
from sqlalchemy import func
from config import app, db, api

from models import Game, Store, Listing

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Games(Resource):
    def get(self):
        games = [game.to_dict(rules=("-listings",)) for game in Game.query.all()]
        return make_response(games, 200)

    def post(self):
        json = request.get_json()
        try:
            new_game = Game(
                title = json['title'],
                rating = json['rating'],
                console = json['console'],
                genre = json['genre'],
                image = json['image']
            )
            db.session.add(new_game)
            db.session.commit()
            return make_response(new_game.to_dict(), 201)
        
        except ValueError as e:
            return {'errors': str(e)}, 400
        
        except Exception as e:
            return {"errors": "Failed to add game to database", 'message': str(e)}, 500
          

class GamesById(Resource):
    def get(self, id):
        game = Game.query.filter(Game.id == id).first()
        return make_response(game.to_dict(rules=("-listings",)), 200)

    def patch(self, id):
        json = request.get_json()
        game = Game.query.filter(Game.id == id).first()
        if game:
            try:
                setattr(game, "title", json['title'])
                setattr(game, "rating", json['rating'])
                setattr(game, "console", json['console'])
                setattr(game, "genre", json['genre'])
                setattr(game, "image", json['image'])
                db.session.add(game)
                db.session.commit()
                return make_response(game.to_dict(rules=("-listings",)), 202)
            except Exception as e:
                return make_response({"errors": "Failed to update game", "message": str(e)}, 400)
        else:
            return make_response({ "error": "Game not found"}, 400)
    
    def delete(self, id):
        game = Game.query.filter(Game.id == id).first()

        if game:
            db.session.delete(game)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Game not found'}, 404


class Stores(Resource):
    def get(self):
        stores = [stores.to_dict(rules=("-listings",)) for stores in Store.query.all()]
        return make_response(stores, 200)

    def post(self):
        json = request.get_json()
        try:
            new_store = Store(
                name = json['name'],
                location = json['location'],
                hours = json['hours'] 
            )
            db.session.add(new_store)
            db.session.commit()
            return make_response(new_store.to_dict(), 201)
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {"errors": "Failed to add store to database", 'message': str(e)}, 500

class StoresById(Resource):
    def get(self, id):
        store = Store.query.filter(Store.id == id).first()
        return make_response(store.to_dict(rules=("-listings",)), 200)
    
    def patch(self, id):
        json = request.get_json()
        store = Store.query.filter(Store.id == id).first()
        if store:
            try:
                setattr(store, "name", json['name'])
                setattr(store, "location", json['location'])
                setattr(store, "hours", json['hours'])
                db.session.add(store)
                db.session.commit()
                return make_response(store.to_dict(rules=("-listings",)), 202)
            except ValueError:
                return make_response({'errors': ["validation errors"]}, 400)
        else:
            return make_response({ "error": "Store not found"}, 400)    

    def delete(self, id):
        store = Store.query.filter(Store.id == id).first()

        if store:
            db.session.delete(store)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Store not found'}, 404
                

class Listings(Resource):
    def get(self):
        listings = [listings.to_dict() for listings in Listing.query.all()]
        return make_response(listings, 200)

    def post(self):
        json = request.get_json()
        try:
            game = Game.query.get(json['game_id'])
            store = Store.query.get(json['store_id'])
            
            if not game or not store:
                return make_response({'error': 'Game or Store not found'}, 404)
            # Create the new listing
            new_listing = Listing(
                condition=json['condition'],
                stock=json['stock'],
                price=json['price'],
                game=game,  # Associate the game object
                store=store  # Associate the store object
            )
            db.session.add(new_listing)
            db.session.commit()
            return make_response(new_listing.to_dict(), 201)
        except Exception as e:
            return {"errors": "Failed to add listing", 'message': str(e)}, 500
        
class ListingsById(Resource):
    def get(self, id):
        listings = Listing.query.filter(Listing.id == id).first()
        return make_response(listings.to_dict(), 200)

    def patch(self, id):
        json = request.get_json()
        listing = Listing.query.filter_by(id=id).first()
        
        if listing:
            game = Game.query.get(json['game_id'])
            store = Store.query.get(json['store_id'])
            
            if game:
                listing.game = game
            if store:
                listing.store = store
            
            listing.condition = json['condition']
            listing.stock = json['stock']
            listing.price = json['price']

            db.session.commit()
            return make_response(listing.to_dict(), 202)
        else:
            return make_response({'error': 'Listing not found'}, 404)

    def delete(self, id):
        listing = Listing.query.filter(Listing.id == id).first()

        if listing:
            db.session.delete(listing)
            db.session.commit()
            return {}, 204
        else:
            return {'error': 'Listing not found'}, 404


api.add_resource(Games, "/games")
api.add_resource(GamesById, "/games/<int:id>")
api.add_resource(Stores, "/stores")
api.add_resource(StoresById, "/stores/<int:id>")
api.add_resource(Listings, "/listings")
api.add_resource(ListingsById, '/listings/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

