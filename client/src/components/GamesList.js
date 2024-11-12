import React, { useState, useEffect } from 'react';
import GameForm from './GameForm';

function GameList() {
    const [games, setGames] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGame, setCurrentGame] = useState(null);

    // Fetch games on component mount
    useEffect(() => {
        fetch("/games")
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error("Error fetching games:", error));
    }, []);

    // Add a new game
    function addGame(newGame) {
        fetch("/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newGame),
        })
            .then(response => response.json())
            .then(addedGame => setGames([...games, addedGame]))
            .catch(error => console.error("Error adding game:", error));
    }

    // Update an existing game
    function updateGame(updatedGame) {
        fetch(`/games/${updatedGame.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
        })
            .then(response => response.json())
            .then((editedGame) => {
                setGames(games.map((game) => (game.id === editedGame.id ? editedGame : game)));
                setIsEditing(false);
                setCurrentGame(null);
            })
            .catch(error => console.error("Error updating game:", error));
    }

    // Delete a game
    function deleteGame(id) {
        fetch(`/games/${id}`, { method: "DELETE" })
            .then(() => {
                setGames(games.filter(game => game.id !== id));
            })
            .catch(error => console.error("Error deleting game:", error));
    }

    // Start editing a game
    function editGame(game) {
        setIsEditing(true);
        setCurrentGame(game);
    }

    return (
        <div>
            <h2>Game List</h2>
            <GameForm 
                addGame={addGame} 
                updateGame={updateGame} 
                isEditing={isEditing} 
                currentGame={currentGame}
            />
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        <h3>{game.title}</h3>
                        {game.image && (
                            <img 
                                src={game.image} 
                                alt={`${game.title} cover`} 
                                style={{ width: "100px", height: "auto" }}
                            />
                        )}
                        <p>Console: {game.console}</p>
                        <p>Rating: {game.rating}</p>
                        <p>Genre: {game.genre}</p>
                        <button onClick={() => editGame(game)}>Edit</button>
                        <button onClick={() => deleteGame(game.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameList;


/*
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
*/