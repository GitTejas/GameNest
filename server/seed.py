#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Game, Store, Listing

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

        # Clear existing data
        db.drop_all()
        db.create_all()

        # Seed Games
        print("Seeding Games...")
        for _ in range(10):
            game = Game(
                title=fake.company() + " Game",  # Random game title
                rating=rc(["E", "T", "M"]),  # Random game rating
                console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),  # Random console
                genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),  # Random genre
                image=fake.image_url()  # Random image URL
            )
            db.session.add(game)

        # Seed Stores
        print("Seeding Stores...")
        for _ in range(5):
            store = Store(
                name=fake.company(),  # Random store name
                location=fake.address(),  # Random store location
                hours=f"{randint(0, 23)}:00 - {randint(0, 23)}:00"  # Random store hours
            )
            db.session.add(store)

        # Commit the games and stores first
        db.session.commit()

        # Seed Listings
        print("Seeding Listings...")
        for _ in range(20):
            listing = Listing(
                price=round(randint(5, 60) + randint(0, 99) / 100, 2),  # Random price
                stock=randint(0, 100),  # Random stock quantity
                condition=rc(["New", "Used"]),  # Random condition
                game_id=rc([game.id for game in Game.query.all()]),  # Random Game ID
                store_id=rc([store.id for store in Store.query.all()])  # Random Store ID
            )
            db.session.add(listing)

        # Commit the listings
        db.session.commit()

        print("Seeding complete!")