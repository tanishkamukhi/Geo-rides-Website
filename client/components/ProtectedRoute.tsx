import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    console.log("ProtectedRoute Loaded");
    console.log("Token:", token);
    console.log("Role:", role);

    if (!token) {
        console.log("Redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        console.log("Role not allowed");
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}