// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import GamePage from './pages/GamePage';
import StorePage from './pages/StorePage';
import ListingPage from './pages/ListingPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/stores" element={<StorePage />} />
        <Route path="/listings" element={<ListingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
