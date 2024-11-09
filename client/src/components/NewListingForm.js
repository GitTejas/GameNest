// src/components/NewListingForm.js

import React, { useState } from 'react';

function NewListingForm() {
  const [formData, setFormData] = useState({
    store_id: '',
    video_game_id: '',
    price: '',
    stock: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        alert('New listing created successfully!');
        setFormData({
          store_id: '',
          video_game_id: '',
          price: '',
          stock: ''
        });
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Listing</h2>
      <label>Store ID:</label>
      <input name="store_id" value={formData.store_id} onChange={handleChange} required />

      <label>Video Game ID:</label>
      <input name="video_game_id" value={formData.video_game_id} onChange={handleChange} required />

      <label>Price:</label>
      <input name="price" value={formData.price} onChange={handleChange} required />

      <label>Stock:</label>
      <input name="stock" value={formData.stock} onChange={handleChange} required />

      <button type="submit">Submit</button>
    </form>
  );
}

export default NewListingForm;
