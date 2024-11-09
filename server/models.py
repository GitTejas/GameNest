from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
# from datetime import datetime, date

from config import db

# Models go here!
class Game(db.Model, SerializerMixin):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    rating = db.Column(db.String)

    console = db.Column(db.String)
    image = db.Column(db.String)
    genre = db.Column(db.String)

    #Add relationship
    listings = db.relationship("Listing", back_populates="game", cascade="all, delete-orphan")

    
    #Serialize Rules
    serialize_rules = ("-listings.game",)

    
    #Validations

    @validates("title")
    def validates_title(self, key, title):
        if not title:
            raise ValueError("Game must have a title.")
        return title
    #key is positional, we only used it for when doing multiple things

    @validates("rating")
    def validates_rating(self, key, rating):
        pass

    @validates("console")
    def validates_console(self, key, console):
        pass

    @validates("image")
    def validates_image(self, key, image):
        pass

    @validates("genre")
    def validates_genre(self, key, genre):
        pass


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
    @validates("name")
    def validates_name(self, key, name):
        if not name:
            raise ValueError("Store must have a name.")
        return name


    @validates("location")
    def validates_location(self, key, location):
        pass


    @validates("hours")
    def validates_hours(self, key, hours):
        if 0 <= hours <= 23:
            return hours
        else:
            raise ValueError('Hours must be between 0 and 23')
        
        
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
    
    @validates("price")
    def validates_price(self, key, price):
        pass

    @validates("stock")
    def validates_stock(self, key, stock):
        pass

    @validates("condition")
    def validates_condition(self, key, condition):
        pass

    @validates("game_id", "store_id")
    def validates_foriegn_key(self, key, id):
        if key == "game_id" and isinstance(id, int):
            return id
        if key == "store_id" and isinstance(id, int):
            return id
        raise ValueError('Id must be an integer')
        

    def __repr__(self):
        return f'<Listing {self.id}>'