import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const isAuth = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}
