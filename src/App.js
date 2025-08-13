import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './components/providers';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import PipelinePage from './pages/PipelinePage';
import ContactsPage from './pages/ContactsPage';
function AppRoutes() {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-lg", children: "Loading..." }) }));
    }
    if (!user) {
        return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }));
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/pipeline", element: _jsx(PipelinePage, {}) }), _jsx(Route, { path: "/contacts", element: _jsx(ContactsPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }));
}
function App() {
    return (_jsx(Providers, { children: _jsx(AppRoutes, {}) }));
}
export default App;
