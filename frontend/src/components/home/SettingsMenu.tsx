import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, LogIn, LogOut, UserPlus } from "lucide-react";
import { THEMES, applyTheme, getSavedTheme } from "../home/config/themes";
import type { ThemeId } from "../home/config/themes";

export type AuthStatus = "loading" | "in" | "out";

type SettingsMenuProps = {
  auth: AuthStatus;
  onLogout: () => void;
};

function SettingsMenu({ auth, onLogout }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(getSavedTheme());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="settings-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`nav-settings ${open ? "open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Settings"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <i className="bi bi-gear-fill"></i>
      </button>

      {open && (
        <div className="settings-popover" role="menu">
          {/* ACCOUNT SECTION */}
          {auth === "out" && (
            <>
              <p className="settings-title">Account</p>

              <Link
                to="/login"
                className="settings-item"
                onClick={() => setOpen(false)}
              >
                <LogIn size={17} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="settings-item"
                onClick={() => setOpen(false)}
              >
                <UserPlus size={17} />
                <span>Register</span>
              </Link>

              <div className="settings-divider" />
            </>
          )}

          {auth === "in" && (
            <>
              <p className="settings-title">Account</p>

              <button
                type="button"
                className="settings-item danger"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>

              <div className="settings-divider" />
            </>
          )}

          {/* ACCENT COLOR SECTION */}
          <p className="settings-title">Accent color</p>

          <div className="theme-list">
            {THEMES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`theme-option ${theme === item.id ? "selected" : ""}`}
                onClick={() => setTheme(item.id)}
                role="menuitemradio"
                aria-checked={theme === item.id}
              >
                <span
                  className="theme-dot"
                  style={{ background: item.color }}
                />
                <span className="theme-name">{item.label}</span>
                {theme === item.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsMenu;
