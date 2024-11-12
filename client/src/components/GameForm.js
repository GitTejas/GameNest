import React, { useState, useEffect } from 'react';

function GameForm({ addGame, updateGame, isEditing, currentGame }) {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [console, setConsole] = useState("");
    const [genre, setGenre] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (isEditing && currentGame) {
            setTitle(currentGame.title);
            setRating(currentGame.rating);
            setConsole(currentGame.console);
            setGenre(currentGame.genre);
            setImage(currentGame.image);
        }
    }, [isEditing, currentGame]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const gameData = { title, rating, console, genre, image };

        if (isEditing) {
            updateGame({ ...gameData, id: currentGame.id });
        } else {
            addGame(gameData);
        }

        // Clear form
        setTitle("");
        setRating("");
        setConsole("");
        setGenre("");
        setImage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Console"
                value={console}
                onChange={(e) => setConsole(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <button type="submit">{isEditing ? "Update Game" : "Add Game"}</button>
        </form>
    );
}

export default GameForm;
