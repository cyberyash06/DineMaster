import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard";
import Menu from "../pages/Menu";
import Order from "../pages/Order";

import ProtectedRoute from "../components/ProtectedRoute";

import Login from '../pages/auth/Login';
import Register from "../pages/auth/Register";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/order" element={<Order />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}
