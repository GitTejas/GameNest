import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function GameForm({ addGame, updateGame, isEditing, currentGame }) {
    // Define a validation schema with Yup
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        rating: Yup.string().required('Rating is required'),
        console: Yup.string().required('Console is required'),
        genre: Yup.string().required('Genre is required'),
        image: Yup.string().url('Invalid URL').required('Image URL is required'),
    });

    // Set up Formik with initial values, validation schema, and onSubmit handler
    const formik = useFormik({
        initialValues: {
            title: '',
            rating: '',
            console: '',
            genre: '',
            image: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const gameData = { ...values };
            if (isEditing && currentGame) {
                updateGame({ ...gameData, id: currentGame.id });
            } else {
                addGame(gameData);
            }
            formik.resetForm(); // Clear the form after submission
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
    }, [isEditing, currentGame]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title ? (
                <div style={{ color: 'red' }}>{formik.errors.title}</div>
            ) : null}

            <input
                type="text"
                name="rating"
                placeholder="Rating"
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.rating && formik.errors.rating ? (
                <div style={{ color: 'red' }}>{formik.errors.rating}</div>
            ) : null}

            <input
                type="text"
                name="console"
                placeholder="Console"
                value={formik.values.console}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.console && formik.errors.console ? (
                <div style={{ color: 'red' }}>{formik.errors.console}</div>
            ) : null}

            <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formik.values.genre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.genre && formik.errors.genre ? (
                <div style={{ color: 'red' }}>{formik.errors.genre}</div>
            ) : null}

            <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image ? (
                <div style={{ color: 'red' }}>{formik.errors.image}</div>
            ) : null}

            <button type="submit">{isEditing ? 'Update Game' : 'Add Game'}</button>
        </form>
    );
}

export default GameForm;
