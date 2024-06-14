import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
function PrivateRoute() {
  const currentUser = useSelector((state) => state.user.currentUser);
  console.log("Current User:", currentUser); // Debugging line
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
