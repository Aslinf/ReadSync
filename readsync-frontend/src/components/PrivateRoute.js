import { Loader } from "../pages/home";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate async authentication check
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout as needed
    }, [isAuthenticated]);

    if (loading) {
        // Render loading indicator while checking authentication
        return <Loader />;
    }

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/sesion" />;
    }

    // Render the protected content if authenticated
    return children;
}

export default PrivateRoute;
