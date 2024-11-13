import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Stores() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetch('/stores')
            .then((response) => response.json())
            .then((data) => setStores(data))
            .catch((error) => console.error('Error fetching stores:', error));
    }, []);

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

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const isValid = await validationSchema.isValid(values);
            if (!isValid) return;

            const newStore = {
                name: values.name,
                location: values.location,
                hours: values.hours,
            };

            const response = await fetch('/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore),
            });

            if (!response.ok) {
                throw new Error('Failed to add store');
            }

            const addedStore = await response.json();
            setStores((prevStores) => [...prevStores, addedStore]);
            resetForm();
        } catch (error) {
            console.error('Error adding store:', error);
        } finally {
            setSubmitting(false);
        }
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
                {({ isValid, isSubmitting, touched }) => (
                    <Form>
                        <div>
                            <Field type="text" name="name" placeholder="Store Name" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field type="text" name="location" placeholder="Location" />
                            <ErrorMessage name="location" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <Field type="text" name="hours" placeholder="Hours" />
                            <ErrorMessage name="hours" component="div" style={{ color: 'red' }} />
                        </div>
                        <button type="submit" disabled={!isValid || isSubmitting || Object.keys(touched).length === 0}>
                            Add Store
                        </button>
                    </Form>
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
