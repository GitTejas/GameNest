// src/pages/ListingPage.js

import React from 'react';
import Listings from '../components/Listings';
import NewListingForm from '../components/NewListingForm';

function ListingPage() {
  return (
    <div>
      <Listings />
      <NewListingForm />
    </div>
  );
}

export default ListingPage;
