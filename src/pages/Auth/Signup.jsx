import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import './styles.css';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signUp({ email, password, confirmPassword, name });
            alert(response?.message || "Success in sign up");
            navigate("/login");
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occured while signing up");
        }
    };

    return (
        <div className="login-container">
            <div className="auth-form">
                <h2 className="auth-title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
                <p className="signup-link">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
