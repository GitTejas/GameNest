// src/components/Stores.js

import React, { useState, useEffect } from 'react';

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetch('/api/stores')
      .then(response => response.json())
      .then(data => setStores(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Stores</h1>
      <ul>
        {stores.map(store => (
          <li key={store.id}>{store.name} - {store.location}</li>
        ))}
      </ul>
    </div>
  );
}

export default Stores;
