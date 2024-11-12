import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameManager from "./GameManager";
import Navbar from "./NavBar";
import Stores from "./Stores";
import Listings from "./Listings";

import GameList from "./GamesList";
import GameForm from './GameForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <h1>GameNest</h1>
        <Routes>
          <Route path="/" element={<GameManager />} />
          {/* <Route path="/games" element={<GameForm />} /> */}
          <Route path="stores" element={<Stores />} />
          <Route path="listings" element={<Listings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
