import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./GamesList";
import GameForm from './GameForm';
import Navbar from "./NavBar";
import Stores from "./Stores";
import Listings from "./Listings";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <h1>Game Collection</h1>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/games" element={<GameForm />} />
          <Route path="stores" element={<Stores />} />
          <Route path="listings" element={<Listings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
