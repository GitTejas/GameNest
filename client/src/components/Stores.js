import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
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

    // Formik hook saved to a variable
    const formik = useFormik({
        initialValues: { name: '', location: '', hours: '' },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm, setSubmitting }) => {
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
        },
    });

    return (
        <div>
            <h2>Stores</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Store Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div style={{ color: 'red' }}>{formik.errors.name}</div>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.location && formik.touched.location && (
                        <div style={{ color: 'red' }}>{formik.errors.location}</div>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        name="hours"
                        placeholder="Hours"
                        value={formik.values.hours}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.hours && formik.touched.hours && (
                        <div style={{ color: 'red' }}>{formik.errors.hours}</div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={
                        !formik.isValid ||
                        formik.isSubmitting ||
                        Object.keys(formik.touched).length === 0
                    }
                >
                    Add Store
                </button>
            </form>
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