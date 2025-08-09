// src/components/auth/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'passenger', // Default role
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        // Basic validation: phone is required for drivers
        if (formData.role === 'driver' && !formData.phone) {
            setError('Phone number is required for drivers.');
            return;
        }

        try {
            await register(formData);
            setMessage('Registration successful! Please proceed to login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. The email might already be in use.';
            setError(errorMessage);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Create an Account</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" name="name" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" name="phone" className="form-control" onChange={handleChange} />
                                    {formData.role === 'driver' && <div className="form-text">Phone number is required for drivers.</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select name="role" value={formData.role} className="form-select" onChange={handleChange}>
                                        <option value="passenger">Passenger</option>
                                        <option value="driver">Driver</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                                {message && <div className="alert alert-success mt-3">{message}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;