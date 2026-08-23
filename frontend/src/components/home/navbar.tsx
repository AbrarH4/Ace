import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../config/ROUTES";
import { LogOut } from "lucide-react";
function Navigation_Bar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="ace-navbar">
      <div className="nav-logo">ACE</div>

      <div className="nav-center">
        <Link to={ROUTES.CHAT}>Workspace</Link>
        <Link to={ROUTES.FLASHCARDS}>Flashcards</Link>
        <Link to={ROUTES.QUIZ}>Quiz</Link>

        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>

        <button className="nav-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div className="nav-settings">
        <i className="bi bi-gear-fill"></i>
      </div>
    </nav>
  );
}

export default Navigation_Bar;
