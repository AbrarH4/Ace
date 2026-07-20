import {
  Home,
  MessageSquare,
  Zap,
  Target,
  Settings,
  GraduationCap,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";
function Sidebar() {
  const location = useLocation();

  return (
    <aside className="chat-sidebar">
      {/* Logo */}

      <div className="sidebar-logo">
        <GraduationCap size={32} />
        <h2>ACE</h2>
      </div>

      {/* Navigation */}

      <nav className="sidebar-nav">
        <Link
          to={ROUTES.HOME}
          className={
            location.pathname === "/" ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          to={ROUTES.CHAT}
          className={
            location.pathname === "/chat"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MessageSquare size={20} />
          <span>Chat</span>
        </Link>

        <Link
          to={ROUTES.FLASHCARDS}
          className={
            location.pathname === "/flashcards"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Zap size={20} />
          <span>Flashcards</span>
        </Link>

        <Link
          to={ROUTES.QUIZ}
          className={
            location.pathname === "/quiz"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Target size={20} />
          <span>Quiz</span>
        </Link>
      </nav>

      {/* Bottom */}

      <div className="sidebar-bottom">
        <button className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
