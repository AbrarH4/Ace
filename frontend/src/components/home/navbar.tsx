import { Link, useNavigate } from "react-router-dom";
// @ts-expect-error - CSS imports are handled by the bundler
import "./home.css";
import { ROUTES } from "../../config/ROUTES";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
function Navigation_Bar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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

      <div className={`nav-center ${menuOpen ? "mobile-open" : ""}`}>
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
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className="nav-settings">
        <i className="bi bi-gear-fill"></i>
      </div>
    </nav>
  );
}

export default Navigation_Bar;
