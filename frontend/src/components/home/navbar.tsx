import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./home.css";
import { ROUTES } from "../../config/ROUTES";
import { API_URL } from "../../config/api";
import { Menu, X, CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import SettingsMenu from "./SettingsMenu";
import type { AuthStatus } from "./SettingsMenu";

function Navigation_Bar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuth] = useState<AuthStatus>("loading");

  // Re-check the session on every page change
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });
        if (!cancelled) setAuth(response.ok ? "in" : "out");
      } catch {
        if (!cancelled) setAuth("out");
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  // Close the mobile menu after navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setAuth("out");
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
        {auth === "in" && (
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
        )}

        <SettingsMenu auth={auth} onLogout={handleLogout} />
      </div>
    </nav>
  );
}

export default Navigation_Bar;
