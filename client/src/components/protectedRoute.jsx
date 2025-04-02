import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/auth/verify`, { withCredentials: true }) // Send credentials (cookies)
            .then(response => {
                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                } else {
                    navigate("/login");
                }
            })
            .catch(error => {
                console.error("Authentication check failed:", error);
                navigate("/login");
            });
    }, [navigate]);

    if (!isAuthenticated) {
        return null; // Prevent rendering until auth check is done
    }

    return children;
};

export default ProtectedRoute;
