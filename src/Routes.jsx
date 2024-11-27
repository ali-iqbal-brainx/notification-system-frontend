import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import Dashboard from './pages/Dashboard/index.jsx';

const ProtectedRoute = () => {
    const { user, accessToken } = useAuth();
    return user && accessToken ? <Outlet /> : <Navigate to="/login" />;
};

const AuthRoute = () => {
    const { user, accessToken } = useAuth();
    return user && accessToken ? <Navigate to="/dashboard" /> : <Outlet />;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
    {
        element: <AuthRoute />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },
        ],
    },
]);

export const AppRouter = () => <RouterProvider router={router} />;

