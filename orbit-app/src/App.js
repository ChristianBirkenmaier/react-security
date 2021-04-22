import React, { lazy, useContext, Suspense } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import AppShell from "./AppShell";
import { AuthProvider } from "./context/AuthContext";
import { FetchProvider } from "./context/FetchContext";
import FourOFour from "./pages/FourOFour";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthContext } from "./context/AuthContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Account = lazy(() => import("./pages/Account"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));

const AuthenticatedRoute = ({ children, ...rest }) => {
    const { isAuthenticated, authState } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated() ? (
                    <AppShell>{children}</AppShell>
                ) : (
                    <Redirect to="/login"></Redirect>
                )
            }></Route>
    );
};

const AdminRoute = ({ children, ...rest }) => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated() && isAdmin() ? (
                    <AppShell>{children}</AppShell>
                ) : (
                    <Redirect to="/login"></Redirect>
                )
            }></Route>
    );
};

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
                <AuthenticatedRoute path="/dashboard">
                    <Dashboard />
                </AuthenticatedRoute>
                <AdminRoute path="/inventory">
                    <Inventory />
                </AdminRoute>

                <Route path="/account">
                    <AppShell>
                        <Account />
                    </AppShell>
                </Route>
                <Route path="/settings">
                    <AppShell>
                        <Settings />
                    </AppShell>
                </Route>
                <AdminRoute path="/users">
                    <Users />
                </AdminRoute>
                <Route path="*">
                    <FourOFour />
                </Route>
            </Switch>
        </Suspense>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <FetchProvider>
                    <div className="bg-gray-100">
                        <AppRoutes />
                    </div>
                </FetchProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
