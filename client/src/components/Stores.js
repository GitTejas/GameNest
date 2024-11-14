import React, { useState, useEffect } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Stores() {
    const [stores, setStores] = useState([]);

    // Fetching stores data on component mount
    useEffect(() => {
        fetch('/stores')
            .then((response) => response.json())
            .then((data) => setStores(data))
            .catch((error) => console.error('Error fetching stores:', error));
    }, []);

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Store name is required')
            .min(2, 'Store name must be at least 2 characters')
            .max(40, 'Store name must be less than 40 characters'),
        location: Yup.string()
            .required('Location is required')
            .test('contains-both', 'Location must contain letters and numbers', (value) => {
                return /\d/.test(value) && /[a-zA-Z]/.test(value);
            }),
        hours: Yup.string()
            .required('Store hours are required')
            .matches(/^(\d{1,2}):00\s*-\s*(\d{1,2}):00$/, 'Hours must be in the format "X:00 - Y:00"'),
    });

    // Handle form submission
    const handleSubmit = (values, { resetForm, setSubmitting }) => {
        const newStore = {
            name: values.name,
            location: values.location,
            hours: values.hours,
        };

        fetch('/stores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStore),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add store');
                }
                return response.json();
            })
            .then((addedStore) => {
                setStores((prevStores) => [...prevStores, addedStore]);
                resetForm();
            })
            .catch((error) => {
                console.error('Error adding store:', error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div>
            <h2>Stores</h2>
            <Formik
                initialValues={{ name: '', location: '', hours: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Store Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.name && touched.name && (
                                <div style={{ color: 'red' }}>{errors.name}</div>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={values.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.location && touched.location && (
                                <div style={{ color: 'red' }}>{errors.location}</div>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="hours"
                                placeholder="Hours"
                                value={values.hours}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.hours && touched.hours && (
                                <div style={{ color: 'red' }}>{errors.hours}</div>
                            )}
                        </div>
                        <button type="submit" disabled={!isValid || isSubmitting || Object.keys(touched).length === 0}>
                            Add Store
                        </button>
                    </form>
                )}
            </Formik>
            <ul>
                {stores.map((store) => (
                    <li key={store.id}>
                        <h3>{store.name}</h3>
                        <p>Location: {store.location}</p>
                        <p>Hours: {store.hours}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Stores;