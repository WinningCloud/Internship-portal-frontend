import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/Login';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
    );
};

export default AppRoutes;
