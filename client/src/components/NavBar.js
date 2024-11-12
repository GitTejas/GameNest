// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Games</Link></li>
                <li><Link to="/stores">Stores</Link></li>
                <li><Link to="/listings">Listings</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
