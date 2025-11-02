import { Navigate } from "react-router-dom"; //Navigate it is a component
                                                // Used inside JSX to automatically redirect the user.

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists → allow access
  return children; //checking means , element={<ProtectedRoute><ChangePassword /> </ProtectedRoute>} />}
};

export default ProtectedRoute;
