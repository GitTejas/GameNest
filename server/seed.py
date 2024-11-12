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

        # Clear existing data
        db.drop_all()
        db.create_all()

        # Predefined list of game titles and images
        predefined_games = [
            {"title": "Mega Man", "image": "https://upload.wikimedia.org/wikipedia/en/b/bf/Mega_Man_X4_PSX.jpg"},
            {"title": "Donkey Kong", "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSuZ4WZ1W_-MfVFcVHuiXseEXJ5YeW5yQAdEb7BQ4thjhQRqp3FTDo4m8T7wXmodDkYDssk"},
            {"title": "Rise of the Ronin", "image": "https://image.api.playstation.com/vulcan/ap/rnd/202212/2201/ZfPosZoz1CKZBHTIKUCQRy47.png"},
            {"title": "Super Smash Bros.", "image": "https://assets.nintendo.com/image/upload/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9"},
            {"title": "Kingdom Hearts", "image": "https://m.media-amazon.com/images/I/918AUL+i-DL.jpg"},
            {"title": "Nioh II", "image": "https://image.api.playstation.com/vulcan/img/rnd/202011/0423/P7Sm4r3F8krCQcnN5uqwsS00.png"},
            {"title": "Elden Ring", "image": "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png"},
            {"title": "Dark Souls 3", "image": "https://static.bandainamcoent.eu/high/dark-souls/dark-souls-3/00-page-setup/ds3_game-thumbnail.jpg"},
            {"title": "Pokemon Fallen Thrones", "image": "https://i.imgur.com/VP0VH7E.png"},
            {"title": "Ninja Gaiden", "image": "https://www.lilithia.net/wp-content/uploads/2021/06/ninjagaidencollection-1576x1182.jpg"},
            {"title": "The Legend of Zelda: Breath of the Wild", "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSO0-bXLKMPSHQECjZUuy4gbwdgmF-7sfhHQ0b59Q2nv8ZZiBzgHEu5mwDuVLBPf71rkB_zQA"},
            {"title": "Grand Theft Auto V", "image": "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png"},
            {"title": "Cyberpunk 2077", "image": "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg"},
            {"title": "The Witcher 3: Wild Hunt", "image": "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg"}
        ]

        # Seed Games with predefined data
        print("Seeding Games...")
        for game_data in predefined_games:
            game = Game(
                title=game_data["title"],
                rating=rc(["E", "T", "M"]),
                console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),
                genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),
                image=game_data["image"]
            )
            db.session.add(game)

        # # Add additional random games if needed
        # print("Seeding additional random Games...")
        # for _ in range(10 - len(predefined_games)):
        #     game = Game(
        #         title=fake.company() + " Game",
        #         rating=rc(["E", "T", "M"]),
        #         console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),
        #         genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),
        #         image=fake.image_url()
        #     )
        #     db.session.add(game)

        # Predefined list of store names and locations
        predefined_stores = [
            {"name": "GameStop", "location": "640 Camino Del Rio N STE 317A, San Diego, CA 92108"},
            {"name": "EB Games", "location": "2612 S Shepherd Dr Houston, TX 77098"},
            {"name": "Best Buy", "location": "3 Mill Creek Dr, Secaucus, NJ 07094"},
            {"name": "Electronics Boutique", "location": "2589 Walter Green Cmns, Madison, OH 44057"},
            {"name": "Gaming Odyssey", "location": "1400 Skyline Blvd, Bismarck, ND 58503"},
        ]

        # Seed Stores with predefined data
        print("Seeding Stores...")
        for store_data in predefined_stores:
            store = Store(
                name=store_data["name"],
                location=store_data["location"],
                hours=f"{randint(8, 10)}:00 - {randint(18, 22)}:00"
            )
            db.session.add(store)

        # Add additional random stores if needed
        print("Seeding additional random Stores...")
        for _ in range(5 - len(predefined_stores)):
            store = Store(
                name=fake.company(),
                location=fake.address(),
                hours=f"{randint(8, 10)}:00 - {randint(18, 22)}:00"
            )
            db.session.add(store)

        # Commit the games and stores first
        db.session.commit()

        # Seed Listings
        print("Seeding Listings...")
        for _ in range(20):
            listing = Listing(
                price=round(randint(5, 60) + randint(0, 99) / 100, 2),
                stock=randint(0, 100),
                condition=rc(["New", "Used"]),
                game_id=rc([game.id for game in Game.query.all()]),
                store_id=rc([store.id for store in Store.query.all()])
            )
            db.session.add(listing)

        # Commit the listings
        db.session.commit()

        print("Seeding complete!")

###################################################################################################
###################################################################################################
###################################################################################################
# #!/usr/bin/env python3

# # Standard library imports
# from random import randint, choice as rc

# # Remote library imports
# from faker import Faker

# # Local imports
# from app import app
# from models import db, Game, Store, Listing

# if __name__ == '__main__':
#     fake = Faker()
#     with app.app_context():
#         print("Starting seed...")

#         # Clear existing data
#         db.drop_all()
#         db.create_all()

#         # Predefined list of game titles and images
#         predefined_games = [
#             {"title": "Mega Man", "image": "https://static.wikia.nocookie.net/megaman/images/4/42/Kotobukiya%27s_X_Model_Kit.jpg/revision/latest?cb=20220501181742"},
#             {"title": "Donkey Kong", "image": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSuZ4WZ1W_-MfVFcVHuiXseEXJ5YeW5yQAdEb7BQ4thjhQRqp3FTDo4m8T7wXmodDkYDssk"},
#             {"title": "Rise of the Ronin", "image": "https://image.api.playstation.com/vulcan/ap/rnd/202212/2201/ZfPosZoz1CKZBHTIKUCQRy47.png"},
#             {"title": "Super Smash Bros.", "image": "https://assets.nintendo.com/image/upload/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9"},
#             {"title": "Kingdom Hearts", "image": "https://m.media-amazon.com/images/I/918AUL+i-DL.jpg"},
#             {"title": "Nioh II", "image": "https://image.api.playstation.com/vulcan/img/rnd/202011/0423/P7Sm4r3F8krCQcnN5uqwsS00.png"},
#             {"title": "Elden Ring", "image": "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png"},
#             {"title": "Dark Souls 3", "image": "https://static.bandainamcoent.eu/high/dark-souls/dark-souls-3/00-page-setup/ds3_game-thumbnail.jpg"},
#             {"title": "Ninja Gaiden", "image": "https://static.wikia.nocookie.net/deadoralive/images/6/62/Img-hayabusa.png/revision/latest/scale-to-width-down/1000?cb=20180613004303"},
#         ]

#         # Seed Games with predefined data
#         print("Seeding Games with predefined data...")
#         for game_data in predefined_games:
#             game = Game(
#                 title=game_data["title"],
#                 rating=rc(["E", "T", "M"]),
#                 console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),
#                 genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),
#                 image=game_data["image"]
#             )
#             db.session.add(game)

#         # Add additional random games if needed
#         print("Seeding additional random Games...")
#         for _ in range(10 - len(predefined_games)):
#             game = Game(
#                 title=fake.company() + " Game",
#                 rating=rc(["E", "T", "M"]),
#                 console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),
#                 genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),
#                 image=fake.image_url()
#             )
#             db.session.add(game)

#         # Seed Stores
#         print("Seeding Stores...")
#         for _ in range(5):
#             store = Store(
#                 name=fake.company(),
#                 location=fake.address(),
#                 hours=f"{randint(0, 23)}:00 - {randint(0, 23)}:00"
#             )
#             db.session.add(store)

#         # Commit the games and stores first
#         db.session.commit()

#         # Seed Listings
#         print("Seeding Listings...")
#         for _ in range(20):
#             listing = Listing(
#                 price=round(randint(5, 60) + randint(0, 99) / 100, 2),
#                 stock=randint(0, 100),
#                 condition=rc(["New", "Used"]),
#                 game_id=rc([game.id for game in Game.query.all()]),
#                 store_id=rc([store.id for store in Store.query.all()])
#             )
#             db.session.add(listing)

#         # Commit the listings
#         db.session.commit()

#         print("Seeding complete!")

###################################################################################################
###################################################################################################
###################################################################################################
# #!/usr/bin/env python3

# # Standard library imports
# from random import randint, choice as rc

# # Remote library imports
# from faker import Faker

# # Local imports
# from app import app
# from models import db, Game, Store, Listing

# if __name__ == '__main__':
#     fake = Faker()
#     with app.app_context():
#         print("Starting seed...")
#         # Seed code goes here!

#         # Clear existing data
#         db.drop_all()
#         db.create_all()

#         # Seed Games
#         print("Seeding Games...")
#         for _ in range(10):
#             game = Game(
#                 title=fake.company() + " Game",  # Random game title
#                 rating=rc(["E", "T", "M"]),  # Random game rating
#                 console=rc(["PlayStation", "Xbox", "PC", "Nintendo Switch"]),  # Random console
#                 genre=rc(["Action", "Adventure", "RPG", "Strategy", "Shooter"]),  # Random genre
#                 image=fake.image_url()  # Random image URL
#             )
#             db.session.add(game)

#         # Seed Stores
#         print("Seeding Stores...")
#         for _ in range(5):
#             store = Store(
#                 name=fake.company(),  # Random store name
#                 location=fake.address(),  # Random store location
#                 hours=f"{randint(0, 23)}:00 - {randint(0, 23)}:00"  # Random store hours
#             )
#             db.session.add(store)

#         # Commit the games and stores first
#         db.session.commit()

#         # Seed Listings
#         print("Seeding Listings...")
#         for _ in range(20):
#             listing = Listing(
#                 price=round(randint(5, 60) + randint(0, 99) / 100, 2),  # Random price
#                 stock=randint(0, 100),  # Random stock quantity
#                 condition=rc(["New", "Used"]),  # Random condition
#                 game_id=rc([game.id for game in Game.query.all()]),  # Random Game ID
#                 store_id=rc([store.id for store in Store.query.all()])  # Random Store ID
#             )
#             db.session.add(listing)

#         # Commit the listings
#         db.session.commit()

#         print("Seeding complete!")




###################################################################################################