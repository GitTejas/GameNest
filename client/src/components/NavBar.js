// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <Link to="/">Games</Link>
      <Link to="/stores">Stores</Link>
      <Link to="/listings">Listings</Link>
    </nav>
  );
}

export default NavBar;