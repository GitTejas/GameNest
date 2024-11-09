// src/components/Listings.js

import React, { useState, useEffect } from 'react';

function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('/api/listings')
      .then(response => response.json())
      .then(data => setListings(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Listings</h1>
      <ul>
        {listings.map(listing => (
          <li key={listing.id}>
            Game ID: {listing.video_game_id}, Store ID: {listing.store_id}, Price: ${listing.price}, Stock: {listing.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Listings;
