import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Using react-router-dom from react-router v7 standard imports
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, token } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return a loading spinner or skeleton if you have one globally available
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!token || !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect to home page
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
