import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import "./style/HomePage.css";

const HomePage = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // ✅ Check who is logged in (driver or user)
  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // "driver" or "user"
    setRole(storedRole);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    // Remove all stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("rollNoOrPlate");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    
    // Disconnect socket if active
    if (window.socket) {
      window.socket.disconnect();
      window.socket = null;
    }

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="logo">BuggyTrackingSys</h2>
        <div className="nav-buttons">
          <Link to="/changepassword">
            <button className="change-btn">Change Password</button>
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Map component handles tracking */}
      <MapComponent userType={role} />
    </div>
  );
};

export default HomePage;
