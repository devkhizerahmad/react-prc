import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

// const ProtectedRoute = () => {
//   const { token, isAuthenticated, user } = useAppSelector(
//     (state) => state?.auth
//   );

//   console.log("token:", user?.id);

//   if (!isAuthenticated || !token) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

const ProtectedRoute = () => {
  const { token, isAuthenticated, user } = useAppSelector(
    (state) => state?.auth
  );
  console.log("AUTH:", { token, isAuthenticated, user });

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (token && !user) {
    return <div >Loading...</div>;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
