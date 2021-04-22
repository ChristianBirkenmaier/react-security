import React, { createContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
    const authAxios = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await authAxios.get("/csrf-token");
            console.log(data);
            authAxios.defaults.headers["X-CSRF-TOKEN"] = data.csrfToken;
        };
        getCsrfToken();
    }, []);

    // authAxios.interceptors.request.use(
    //     (config) => {
    //         config.headers.Authorization = `Bearer ${authContext.authState.token}`;
    //         return config;
    //     },
    //     (error) => {
    //         return Promise.reject(error);
    //     }
    // );

    return (
        <Provider
            value={{
                authAxios,
            }}>
            {children}
        </Provider>
    );
};

export { FetchContext, FetchProvider };
