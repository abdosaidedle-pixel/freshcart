"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token") || Cookies.get("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp && decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                    setUserData(decoded);
                    localStorage.setItem("token", storedToken);
                    Cookies.set("token", storedToken, { expires: 7 });
                } else {
                    localStorage.removeItem("token");
                    Cookies.remove("token");
                }
            } catch {
                localStorage.removeItem("token");
                Cookies.remove("token");
            }
        }
        setIsLoading(false);
    }, []);

    function login(newToken, rememberMe = true) {
        localStorage.setItem("token", newToken);

        if (rememberMe) {
            Cookies.set("token", newToken, { expires: 7 });
        } else {
            Cookies.set("token", newToken);
        }

        setToken(newToken);
        try {
            const decoded = jwtDecode(newToken);
            setUserData(decoded);
        } catch {
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("savedEmail");
        Cookies.remove("token");
        setToken(null);
        setUserData(null);
    }

    return (
        <AuthContext.Provider value={{ token, userData, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
