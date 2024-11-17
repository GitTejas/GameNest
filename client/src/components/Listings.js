import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Listings() {
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [sortCriterion, setSortCriterion] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [games, setGames] = useState([]); 
  const [stores, setStores] = useState([]);

  // Fetch listings, games, and stores
  useEffect(() => {
    fetch('/listings')
      .then((response) => response.json())
      .then((data) => setListings(data))
      .catch((error) => console.error('Error fetching listings:', error));

    Promise.all([
      fetch('/games').then((res) => res.json()),
      fetch('/stores').then((res) => res.json()),
    ])
      .then(([gamesData, storesData]) => {
        setGames(gamesData);
        setStores(storesData);
      })
      .catch((error) => console.error('Error fetching games and stores:', error));
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
      } else if (sortCriterion === 'latest') {
        return new Date(b.created_at) - new Date(a.created_at); // Sort by date descending (latest first)
      }
      return 0;
    });

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'is-valid-condition',
        'Condition must be either "New" or "Used"',
        (value) => ['new', 'used'].includes(value?.toLowerCase())
      ),
    stock: Yup.number()
      .required('Stock is required')
      .min(0, 'Stock cannot be negative')
      .max(100, 'Stock must be between 0 and 100'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number')
      .min(0.01, 'Price must be greater than 0'),
    game_id: Yup.number()
      .required('Must Select a Game')
      .positive('Game ID must be a positive number')
      .integer('Game ID must be an integer'),
    store_id: Yup.number()
      .required('Must Select a Store')
      .positive('Store ID must be a positive number')
      .integer('Store ID must be an integer'),
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
      if (!formik.isValid) return;

      const method = editingListing ? 'PATCH' : 'POST';
      const url = editingListing ? `/listings/${editingListing.id}` : '/listings';

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Server validation failed');
          }
          return response.json();
        })
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
  
    // Scroll to the form after setting the values for editing
    window.scrollTo({
      top: document.getElementById('form-container').offsetTop, 
      behavior: 'smooth', 
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
      <h2>Post a Listing!</h2>

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
        <option value="latest">Latest Date Added</option>
      </select>

      {/* Price Filter Buttons */}
      <div>
        <button onClick={() => setPriceFilter('all')}>All</button>
        <button onClick={() => setPriceFilter('under30')}>Under $30</button>
        <button onClick={() => setPriceFilter('over30')}>Over $30</button>
      </div>

      <form onSubmit={formik.handleSubmit} id="form-container">
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

        {/* Game Dropdown */}
        <select
          name="game_id"
          value={formik.values.game_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select a Game</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.title}
            </option>
          ))}
        </select>
        {formik.touched.game_id && formik.errors.game_id && <div>{formik.errors.game_id}</div>}

        {/* Store Dropdown */}
        <select
          name="store_id"
          value={formik.values.store_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select a Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        {formik.touched.store_id && formik.errors.store_id && <div>{formik.errors.store_id}</div>}

        <button type="submit">{editingListing ? 'Update Listing' : 'Add Listing'}</button>
      </form>

      <ul>
        {filteredAndSortedListings.map((listing) => (
          <li key={listing.id}>
            <div className="listing-title">{listing.game?.title}</div>
            <div className="listing-store">{listing.store?.name}</div>
            <div className="listing-details">
              <div className="price-condition">
                <span className="price">${listing.price}</span>
                <span className="condition">{listing.condition}</span>
              </div>
              <div className="stock-date">
                <span className="stock">{listing.stock} in stock</span>
                <span className="date">Listed on: {listing.created_at}</span>
              </div>
            </div>
            <div className="buttons">
              <button onClick={() => handleEdit(listing)}>Edit</button>
              <button onClick={() => handleDelete(listing.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Listings;