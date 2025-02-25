import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../Pages/Dashboard';
import JourneyDetails from '../Pages/JourneyDetails';
import CreateJourney from '../Pages/CreateJourney';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<Layout />}>
                    {/* Dashboard */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />

                    {/* Journey Routes */}
                    <Route path="/journeys">
                        <Route path="new" element={
                            <PrivateRoute>
                                <CreateJourney />
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute>
                                <JourneyDetails />
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Redirect unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;