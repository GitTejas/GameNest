import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function GameManager() {
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

    // Form validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        rating: Yup.string().required('Rating is required'),
        console: Yup.string().required('Console is required'),
        genre: Yup.string().required('Genre is required'),
        image: Yup.string().url('Invalid URL').required('Image URL is required'),
    });

    // Formik configuration
// Formik configuration
const formik = useFormik({
    initialValues: {
        title: '',
        rating: '',
        console: '',
        genre: '',
        image: '',
    },
    validationSchema, // Ensure you have the Yup schema defined above
    onSubmit: (values) => {
        // Prevent submit if form is invalid
        if (!formik.isValid) return;

        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing ? `/games/${currentGame.id}` : '/games';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server validation failed");
                }
                return response.json();
            })
            .then((addedGame) => {
                // If editing, update the game in the state, otherwise add a new game
                if (isEditing) {
                    setGames((prevGames) =>
                        prevGames.map((game) =>
                            game.id === addedGame.id ? addedGame : game
                        )
                    );
                } else {
                    setGames((prevGames) => [...prevGames, addedGame]);
                }

                // Reset form and state after successful submission
                formik.resetForm();
                setIsEditing(false);
                setCurrentGame(null);
            })
            .catch((error) => console.error('Error adding or updating game:', error));
    },
});


    // Populate form fields when editing an existing game
    useEffect(() => {
        if (isEditing && currentGame) {
            formik.setValues({
                title: currentGame.title,
                rating: currentGame.rating,
                console: currentGame.console,
                genre: currentGame.genre,
                image: currentGame.image,
            });
        }
    }, [isEditing, currentGame, formik]);

    // CRUD functions
    const addGame = (newGame) => {
        fetch("/games", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newGame),
        })
            .then(response => response.json())
            .then(addedGame => setGames(prevGames => [...prevGames, addedGame]))
            .catch(error => console.error("Error adding game:", error));
    };

    const updateGame = (updatedGame) => {
        fetch(`/games/${updatedGame.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
        })
            .then(response => response.json())
            .then((editedGame) => {
                setGames(prevGames =>
                    prevGames.map((game) =>
                        game.id === editedGame.id ? editedGame : game
                    )
                );
            })
            .catch(error => console.error("Error updating game:", error));
    };

    const deleteGame = (id) => {
        fetch(`/games/${id}`, { method: "DELETE" })
            .then(() => setGames(prevGames => prevGames.filter(game => game.id !== id)))
            .catch(error => console.error("Error deleting game:", error));
    };

    const editGame = (game) => {
        setIsEditing(true);
        setCurrentGame(game);
    };

    return (
        <div>
            <h2>Game Form</h2>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                    <div style={{ color: 'red' }}>{formik.errors.title}</div>
                )}

                <input
                    type="text"
                    name="rating"
                    placeholder="Rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.rating && formik.errors.rating && (
                    <div style={{ color: 'red' }}>{formik.errors.rating}</div>
                )}

                <input
                    type="text"
                    name="console"
                    placeholder="Console"
                    value={formik.values.console}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.console && formik.errors.console && (
                    <div style={{ color: 'red' }}>{formik.errors.console}</div>
                )}

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={formik.values.genre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.genre && formik.errors.genre && (
                    <div style={{ color: 'red' }}>{formik.errors.genre}</div>
                )}

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={formik.values.image}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image && (
                    <div style={{ color: 'red' }}>{formik.errors.image}</div>
                )}

                <button type="submit">{isEditing ? 'Update Game' : 'Add Game'}</button>
            </form>

            <h2>Game List</h2>
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

export default GameManager;
