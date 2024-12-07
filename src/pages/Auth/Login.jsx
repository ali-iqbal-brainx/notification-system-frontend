import React, { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { Link } from 'react-router-dom';
import './styles.css';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="login-container">
            <div className="auth-form">
                <h2 className="auth-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-button">Login</button>
                </form>
                <p className="signup-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;
