import React, { useState, useEffect, createContext } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    const [authState, setAuthState] = useState({
        token: null,
        expiresAt: localStorage.getItem("expiresAt") || null,
        userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
    });

    const setAuthInfo = ({ token, userInfo, expiresAt }) => {
        // localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("expiresAt", expiresAt);
        setAuthState({ token, userInfo, expiresAt });
    };

    const isAuthenticated = () => {
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return new Date().getTime() / 1000 < authState.expiresAt;
    };

    const isAdmin = () => {
        if (!isAuthenticated()) {
            return false;
        }
        return authState.userInfo.role === "admin";
    };

    const logout = () => {
        // localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expiresAt");
        setAuthState({ token: null, expiresAt: null, userInfo: {} });
        history.push("/login");
    };
    return (
        <Provider
            value={{
                authState,
                setAuthState: (authInfo) => setAuthInfo(authInfo),
                isAuthenticated,
                logout,
                isAdmin,
            }}>
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };
