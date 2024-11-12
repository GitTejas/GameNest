import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Stores() {
    const [stores, setStores] = useState([]);

    // Fetch stores on component mount
    useEffect(() => {
        fetch('/stores')
            .then((response) => response.json())
            .then((data) => setStores(data))
            .catch((error) => console.error('Error fetching stores:', error));
    }, []);

    // Form validation schema with Yup
    const validationSchema = Yup.object({
        name: Yup.string().required('Store name is required'),
        location: Yup.string().required('Location is required'),
        hours: Yup.string().required('Store hours are required'),
    });

    // Handle store submission
    const handleSubmit = (values, { resetForm }) => {
        const newStore = { name: values.name, location: values.location, hours: values.hours };

        fetch('/stores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStore),
        })
            .then((response) => response.json())
            .then((addedStore) => {
                setStores((prevStores) => [...prevStores, addedStore]);
                resetForm();
            })
            .catch((error) => console.error('Error adding store:', error));
    };

    return (
        <div>
            <h2>Stores</h2>
            <Formik
                initialValues={{ name: '', location: '', hours: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <div>
                        <Field
                            type="text"
                            name="name"
                            placeholder="Store Name"
                        />
                        <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <Field
                            type="text"
                            name="location"
                            placeholder="Location"
                        />
                        <ErrorMessage name="location" component="div" style={{ color: 'red' }} />
                    </div>
                    <div>
                        <Field
                            type="text"
                            name="hours"
                            placeholder="Hours"
                        />
                        <ErrorMessage name="hours" component="div" style={{ color: 'red' }} />
                    </div>
                    <button type="submit">Add Store</button>
                </Form>
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
