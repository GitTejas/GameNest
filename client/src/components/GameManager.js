import React, { useState, useEffect, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function GameManager() {
    const [games, setGames] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGame, setCurrentGame] = useState(null);
    const [sortBy, setSortBy] = useState(""); // New state to manage sorting
    const formRef = useRef(null);

    useEffect(() => {
        fetch("/games")
            .then(response => response.json())
            .then(data => setGames(data))
            .catch(error => console.error("Error fetching games:", error));
    }, []);

    // Handle sorting based on sortBy value
    const sortedGames = [...games].sort((a, b) => {
        if (sortBy === "title") {
            return a.title.localeCompare(b.title);  
        } else if (sortBy === "rating") {
            return a.rating.localeCompare(b.rating); 
        } else if (sortBy === "console") {
            return a.console.localeCompare(b.console);  
        } else if (sortBy === "genre") {
            return a.genre.localeCompare(b.genre); 
        }
        return 0;  // No sorting if no option selected
    });

    // Validation schema
    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required')
            .min(2, 'Title must be at least 2 characters')
            .max(60, 'Title must be less than 60 characters'),
        
        rating: Yup.string()
            .required('Rating is required')
            .test(
                'is-valid-rating',
                'Rating must be either E, T, or M',
                value => value && ['e', 't', 'm'].includes(value.toLowerCase())
            ),
        
        console: Yup.string()
        .required('Console is required')
        .transform(value => value ? value.toLowerCase() : value)
        .oneOf(['playstation', 'xbox', 'pc', 'nintendo switch'], 'Console must be either PlayStation, Xbox, PC, or Nintendo Switch'),
        
        genre: Yup.string()
            .required('Genre is required')
            .min(2, 'Genre must be more than 2 characters'),
        
        image: Yup.string()
            .url('Invalid URL')
            .required('Image URL is required'),
    });

    // Handle form submission
    const handleSubmit = (values, { resetForm, setSubmitting }) => {
        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing ? `/games/${currentGame.id}` : '/games';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server validation failed");
                }
                return response.json();
            })
            .then((addedGame) => {
                setGames((prevGames) =>
                    isEditing
                        ? prevGames.map((game) =>
                            game.id === addedGame.id ? addedGame : game
                        )
                        : [...prevGames, addedGame]
                );

                resetForm();
                setIsEditing(false);
                setCurrentGame(null);
            })
            .catch((error) => console.error('Error adding or updating game:', error))
            .finally(() => setSubmitting(false));
    };

    const editGame = (game) => {
        setIsEditing(true);
        setCurrentGame(game);
        if (formRef.current) {
            // Scroll to the form container when "Edit" button is clicked
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const deleteGame = (id) => {
        fetch(`/games/${id}`, { method: "DELETE" })
            .then(() => setGames((prevGames) => prevGames.filter(game => game.id !== id)))
            .catch(error => console.error("Error deleting game:", error));
    };

    return (
        <div>
            <h2>Game Form</h2>
            <div ref={formRef}>
                <Formik
                    initialValues={{
                        title: currentGame?.title || '',
                        rating: currentGame?.rating || '',
                        console: currentGame?.console || '',
                        genre: currentGame?.genre || '',
                        image: currentGame?.image || '',
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isValid, isSubmitting, touched }) => (
                        <Form>
                            <div>
                                <Field type="text" name="title" placeholder="Title" />
                                <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field type="text" name="rating" placeholder="Rating" />
                                <ErrorMessage name="rating" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field type="text" name="console" placeholder="Console" />
                                <ErrorMessage name="console" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field type="text" name="genre" placeholder="Genre" />
                                <ErrorMessage name="genre" component="div" style={{ color: 'red' }} />
                            </div>
                            <div>
                                <Field type="text" name="image" placeholder="Image URL" />
                                <ErrorMessage name="image" component="div" style={{ color: 'red' }} />
                            </div>
                            <button type="submit" disabled={!isValid || isSubmitting || Object.keys(touched).length === 0}>
                                {isEditing ? 'Update Game' : 'Add Game'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            <label>Sort By: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Select</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Rating</option>
                <option value="console">Console</option>
                <option value="genre">Genre</option>
            </select>

            <h2>Game List</h2>
            <ul>
                {sortedGames.map((game) => (
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
                        <div className="button-group">
                            <button onClick={() => editGame(game)}>Edit</button>
                            <button onClick={() => deleteGame(game.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameManager;
