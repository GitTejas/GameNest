import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./GamesList";
import GameForm from './GameForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Game Collection</h1>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/add-game" element={<GameForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
