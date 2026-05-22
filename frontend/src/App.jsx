import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; // استيراد صفحة البروفايل

export default function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}