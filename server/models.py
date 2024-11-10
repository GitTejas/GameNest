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
    genre = db.Column(db.String)
    image = db.Column(db.String)

    #Add relationship
    listings = db.relationship("Listing", back_populates="game", cascade="all, delete-orphan")

    
    #Serialize Rules
    serialize_rules = ("-listings.game",)

    
    #Validations

    @validates("title")
    def validates_title(self, key, title):
        if isinstance(title, str) and 1 < len(title) < 60:
            return title
        else:
            raise ValueError("Title must be a string with more than 1 character and less than 60 characters.")


    @validates("rating")
    def validates_rating(self, key, rating):
        if rating in ("E", "T", "M"):
            return rating
        else:
            raise ValueError("Rating must be either E, T, or M")


    @validates("console")
    def validates_console(self, key, console):
        # List of valid consoles
        valid_consoles = {"PlayStation", "Xbox", "PC", "Nintendo Switch"}        
        if isinstance(console, str):
            if console in valid_consoles:
                return console
            else:
                raise ValueError("Console must be PlayStation, Xbox, PC, or Nintendo Switch")
        elif isinstance(console, (list, set)):
            if all(c in valid_consoles for c in console):
                return console
            else:
                raise ValueError("Each console must be one of PlayStation, Xbox, PC, or Nintendo Switch")
        else:
            raise ValueError("Console must be a string or a list of valid console names")


    @validates("genre")
    def validates_genre(self, key, genre):
        if isinstance(genre, str) and 1 < len(genre) < 25:
            return genre
        else:
            raise ValueError("Genre must be a string with more than 1 character and less than 25 characters")


    @validates("image")
    def validates_image(self, key, image):
        if not isinstance(image, str) or not image.strip():
            raise ValueError("Image must be a non-empty string.")
        return image

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
        if isinstance(name, str) and 1 < len(name) < 40:
            return name
        else:
            raise ValueError("Store name must be a string with more than 1 character and less than 40 characters.")

    @validates("location")
    def validates_location(self, key, location):
        if not isinstance(location, str) or not location.strip():
            raise ValueError("Location must be a non-empty string.")        
        # Check for at least one letter and one number
        has_letter = any(char.isalpha() for char in location)
        has_number = any(char.isdigit() for char in location)
        if has_letter and has_number:
            return location
        else:
            raise ValueError("Location must contain both letters and numbers.")


    @validates("hours")
    def validates_hours(self, key, hours):
        # Ensure hours is an integer and within the valid range
        try:
            hours = int(hours)  # Convert hours to an integer if it's not already
        except ValueError:
            raise ValueError('Hours must be a valid integer between 0 and 23.')
        
        if 0 <= hours <= 23:
            return hours
        else:
            raise ValueError('Hours must be between 0 and 23.')

        
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