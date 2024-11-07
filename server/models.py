from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
# from datetime import datetime, date

from config import db

# Models go here!
class Game(db.Model, SerializerMixin):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    rating = db.Column(db.String)

    console = db.Column(db.String)
    image = db.Column(db.String)
    genre = db.Column(db.String)

    #Add relationship
    listings = db.relationship("Listing", back_populates="game", cascade="all, delete-orphan")

    
    #Serialize Rules
    serialize_rules = ("-listings.game",)

    
    #Validations

    #repr
    def __repr__(self):
        return f'<Game {self.id}: {self.title}>'



class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    location = db.Column(db.String, nullable=False)
    hours = db.Column(db.String)


    #Add relationship
    listings = db.relationship("Listing", back_populates="store", cascade="all, delete-orphan")

    
    #Serialize Rules
    serialize_rules = ("-listings.store",)

    
    #Validations


    #repr
    def __repr__(self):
        return f'<Store {self.id}: {self.name}>'

class Listing(db.Model, SerializerMixin):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float)
    stock = db.Column(db.String, nullable=False)
    condition = db.Column(db.String)

    game_id = db.Column(db.Integer, db.ForeignKey("games.id"))
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"))

    #Add relationship
    game = db.relationship("Game", back_populates="listings")
    store = db.relationship("Store", back_populates="listings")

    
    #Serialize Rules
    serialize_rules = ("-game.listings", "-store.listings")

    
    #Validations


    #repr
    def __repr__(self):
        return f'<Listing {self.id}>'