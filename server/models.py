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
        # Convert the rating to uppercase for case-insensitive comparison
        if rating.upper() in ("E", "T", "M"):
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
        # Ensure the hours string is in the correct format
        try:
            # Split the hours string by " - "
            start_time, end_time = hours.split(" - ")

            # Extract the hour part (before the ":")
            start_hour = int(start_time.split(":")[0])
            end_hour = int(end_time.split(":")[0])

            # Check if both start and end hours are valid
            if not (0 <= start_hour <= 23 and 0 <= end_hour <= 23):
                raise ValueError('Hours must be between 0 and 23.')

        except (ValueError, IndexError):
            # Catch any issues with parsing or invalid time ranges
            raise ValueError('Hours must be in the format "X:00 - Y:00" with valid hours between 0 and 23.')

        # Return the hours if valid
        return hours

    def __repr__(self):
        return f'<Store {self.id}: {self.name}>'


class Listing(db.Model, SerializerMixin):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Float)
    stock = db.Column(db.Integer, nullable=False)
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
        # Ensure price is a positive number (float or int)
        if isinstance(price, (float, int)) and price >= 0:
            return price
        else:
            raise ValueError("Price must be a positive number (float or int).")

    @validates("stock")
    def validates_stock(self, key, stock):
        # Ensure stock is an integer and within the valid range (0 to 100)
        if isinstance(stock, int) and 0 <= stock <= 100:
            return stock
        else:
           raise ValueError("Stock must be an integer between 0 and 100, inclusive.")

    @validates("condition")
    def validates_condition(self, key, condition):
        # Convert condition to title case to handle case insensitivity
        condition = condition.strip().title()

        if condition in ("New", "Used"):
            return condition
        else:
            raise ValueError("Condition must be either 'New' or 'Used'.")

    @validates("game_id", "store_id")
    def validates_foreign_key(self, key, id):
        # Validate game_id
        if key == "game_id":
            if isinstance(id, int) and id > 0:
                return id
            else:
                raise ValueError("game_id must be a positive integer")
        # Validate store_id
        if key == "store_id":
            if isinstance(id, int) and id > 0:
                return id
            else:
                raise ValueError("store_id must be a positive integer")
        # Default case (shouldn't happen with valid keys)
        raise ValueError(f"{key} is invalid")

    # @validates("game_id", "store_id")
    # def validates_foreign_key(self, key, id):
    #     if isinstance(id, int) and id > 0:
    #         return id
    #     else:
    #         raise ValueError(f'{key} must be a positive integer')    

    def __repr__(self):
        return f'<Listing {self.id}>'