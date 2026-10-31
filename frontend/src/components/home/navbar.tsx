import { Link, NavLink, useNavigate } from "react-router-dom";
// @ts-expect-error - CSS imports are handled by the bundler
import "./home.css";
import { ROUTES } from "../../config/ROUTES";
import { LogOut, Menu, X, CircleUser } from "lucide-react";
import { useState } from "react";
import SettingsMenu from "./SettingsMenu";

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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <nav className="ace-navbar">
      <div className="nav-logo">ACE</div>

      <div className={`nav-center ${menuOpen ? "mobile-open" : ""}`}>
        <NavLink to={ROUTES.CHAT} className={linkClass}>
          Workspace
        </NavLink>
        <NavLink to={ROUTES.FLASHCARDS} className={linkClass}>
          Flashcards
        </NavLink>
        <NavLink to={ROUTES.QUIZ} className={linkClass}>
          Quiz
        </NavLink>

        <NavLink to="/register" className={linkClass}>
          Register
        </NavLink>
        <NavLink to="/login" className={linkClass}>
          Login
        </NavLink>

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

      <div className="nav-actions">
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            `nav-settings nav-profile ${isActive ? "active" : ""}`
          }
          aria-label="Profile"
          title="Profile"
        >
          <CircleUser size={20} />
        </NavLink>

        <SettingsMenu />
      </div>
    </nav>
  );
}

export default Navigation_Bar;
