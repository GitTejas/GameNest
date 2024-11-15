# Game Manager: GameNest

The Video Game Store Inventory Tracker is a full-stack application designed for video game store owners and managers to efficiently manage their inventory, listings, and associated video games. Built using React for the frontend and Flask with SQLAlchemy for the backend, this app provides an intuitive interface for tracking video game stock, managing listings, and organizing store information.

---

## Features

Game Management: Add and manage video games and the genre, console and ESRB rating

Store Management: Create and view stores with their details such as address and operational hours.

Listing Management:
Create listings for available video games at different stores.

Monitor pricing, quantity available, and condition of each listing.

Update listing details and remove listings when necessary.


## Tech Stack
Frontend: React (with React Router for navigation), Formik and Yup (for form handling and validation)
Backend: Flask (Flask-RESTful for API endpoints)
Database: SQLAlchemy (with Flask-SQLAlchemy as the ORM)


## Models
1. Game
Represents a video game with fields like title, genre, platform, and rating.
2. Store
Represents a store with attributes such as name, address, hours of operation, and location.
3. Listing
Represents a listing for a video game at a specific store, including attributes for price, quantity available, condition, and associations with the store and video game.

## Relationships
Store to Listing: One-to-Many relationship where a store can have multiple listings.

Game to Listing: One-to-Many relationship where a video game can have multiple listings across different stores.

Store to Game: Many-to-Many relationship managed through the Listing model as the association table, allowing for video games to be listed at multiple stores.

## Database Integrity

To ensure data integrity and prevent invalid entries:

Constraints and Validations are implemented to safeguard the database.
Field-specific constraints are applied, such as ensuring unique values where required and limitations on nullability.
Form validation with Yup ensures that data integrity is maintained on both the frontend and backend.

## Usage
Add and Manage Video Games: Add new video games with their details.
View and Create Stores: Create new stores and view location and hours of operation
Create Listings: Set up listings for video games at different stores, specifying pricing, quantity, and condition. Update or remove listings as needed.

## Form Handling
Formik is utilized for handling form submissions, and Yup is employed for schema-based validation, ensuring reliable input management across the application.

## Setup

run:

-backend-

pipenv install

pipenv shell

cd server directory

python seed.py

python app.py

-front-end-

open new terminal window

cd client directory

npm install

npm start

---

## Conclusion

Please feel free to open issues or submit pull requests to improve the GameNest Game Manager.