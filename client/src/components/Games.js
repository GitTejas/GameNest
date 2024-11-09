// src/components/Games.js

import React, { useState, useEffect } from 'react';

function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('/api/games')
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Video Games</h1>
      <ul>
        {games.map(game => (
          <li key={game.id}>{game.title} - {game.genre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Games;
