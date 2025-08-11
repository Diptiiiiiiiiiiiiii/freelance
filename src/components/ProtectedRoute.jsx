import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ type = "private", children }) => {
  const { token } = useSelector((state) => state.auth);

  if (type === "private" && !token) {
    return <Navigate to="/login" replace />;
  }

  if (type === "public" && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
