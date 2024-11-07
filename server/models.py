from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime, date

from config import db

# Models go here!
class Game(db.Model, SerializerMixin):
    pass





class Store(db.Model, SerializerMixin):
    pass






class Listing(db.Model, SerializerMixin):
    pass
