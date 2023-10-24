import React, {createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    // state variables
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Retrieve token and username from local storage
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        // If a token exsists in local storage, update state variables
        if(storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }

        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <AuthContext.Provider
        value = {{
            isAuthenticated,
            setIsAuthenticated,
            token,
            setToken,
            username,
            setUsername
        }}
        >
            {children} {/* Render children components */}
        </AuthContext.Provider>
    );    


};