import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  console.log("Auth", token, "user", user?.id);
  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Token exists but profile still loading
  if (token && !user) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        Loading profile...
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
