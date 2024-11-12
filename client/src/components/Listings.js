import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Listings() {
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [sortCriterion, setSortCriterion] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // New state for price filter

  // Fetch listings on component mount
  useEffect(() => {
    fetch('/listings')
      .then((response) => response.json())
      .then((data) => setListings(data))
      .catch((error) => console.error('Error fetching listings:', error));
  }, []);

  // Filter and sort listings
  const filteredAndSortedListings = [...listings]
    .filter((listing) => {
      if (priceFilter === 'under30') return listing.price < 30;
      if (priceFilter === 'over30') return listing.price >= 30;
      return true;
    })
    .sort((a, b) => {
      if (sortCriterion === 'game') {
        return (a.game?.title || '').localeCompare(b.game?.title || '');
      } else if (sortCriterion === 'store') {
        return (a.store?.name || '').localeCompare(b.store?.name || '');
      }
      return 0;
    });

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    condition: Yup.string().required('Condition is required'),
    stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be negative'),
    price: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
    game_id: Yup.string().required('Game ID is required'),
    store_id: Yup.string().required('Store ID is required'),
  });

  const formik = useFormik({
    initialValues: {
      condition: '',
      stock: '',
      price: '',
      game_id: '',
      store_id: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const method = editingListing ? 'PATCH' : 'POST';
      const url = editingListing ? `/listings/${editingListing.id}` : '/listings';

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((addedListing) => {
          if (editingListing) {
            setListings((prevListings) =>
              prevListings.map((listing) =>
                listing.id === addedListing.id ? addedListing : listing
              )
            );
          } else {
            setListings((prevListings) => [...prevListings, addedListing]);
          }
          formik.resetForm();
          setEditingListing(null);
        })
        .catch((error) => console.error('Error adding or updating listing:', error));
    },
  });

  const handleEdit = (listing) => {
    setEditingListing(listing);
    formik.setValues({
      condition: listing.condition || '',
      stock: listing.stock || '',
      price: listing.price || '',
      game_id: listing.game_id || '',
      store_id: listing.store_id || '',
    });
  };

  const handleDelete = (id) => {
    fetch(`/listings/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
      })
      .catch((error) => console.error('Error deleting listing:', error));
  };

  return (
    <div>
      <h2>Listings</h2>

      {/* Sorting dropdown */}
      <label htmlFor="sort">Sort by: </label>
      <select
        id="sort"
        value={sortCriterion}
        onChange={(e) => setSortCriterion(e.target.value)}
      >
        <option value="">Select</option>
        <option value="game">Game Title (A-Z)</option>
        <option value="store">Store Name (A-Z)</option>
      </select>
      <br>
      </br>
      <br>
      </br>
      {/* Price Filter Buttons */}
      <div>
        <button onClick={() => setPriceFilter('all')}>All</button>
        <button onClick={() => setPriceFilter('under30')}>Under $30</button>
        <button onClick={() => setPriceFilter('over30')}>Over $30</button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={formik.values.condition}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.condition && formik.errors.condition && <div>{formik.errors.condition}</div>}

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formik.values.stock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.stock && formik.errors.stock && <div>{formik.errors.stock}</div>}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.price && formik.errors.price && <div>{formik.errors.price}</div>}

        <input
          type="text"
          name="game_id"
          placeholder="Game ID"
          value={formik.values.game_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.game_id && formik.errors.game_id && <div>{formik.errors.game_id}</div>}

        <input
          type="text"
          name="store_id"
          placeholder="Store ID"
          value={formik.values.store_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.store_id && formik.errors.store_id && <div>{formik.errors.store_id}</div>}

        <button type="submit">{editingListing ? 'Update Listing' : 'Add Listing'}</button>
      </form>

      <ul>
        {filteredAndSortedListings.map((listing) => (
          <li key={listing.id}>
            <h3>Game: {listing.game ? listing.game.title : 'No Title Available'}</h3>
            <p>Condition: {listing.condition}</p>
            <p>Stock: {listing.stock}</p>
            <p>Price: ${listing.price}</p>
            <p>Store: {listing.store ? listing.store.name : 'No Store Available'}</p>
            <button onClick={() => handleEdit(listing)}>Edit</button>
            <button onClick={() => handleDelete(listing.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Listings;
