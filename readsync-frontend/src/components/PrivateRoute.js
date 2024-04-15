import { Loader } from "../pages/home";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000); 
    }, [isAuthenticated]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        // Enviamos al login si no ha iniciado sesión
        return <Navigate to="/sesion" />;
    }

    return children;
}

export default PrivateRoute;
