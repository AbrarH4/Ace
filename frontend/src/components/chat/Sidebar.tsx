import {
  Home,
  MessageSquare,
  Zap,
  Target,
  Settings,
  GraduationCap,
  FileText,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";

type SidebarProps = {
  uploadedNotes: string[];
};

function Sidebar({ uploadedNotes }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="chat-sidebar">
      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}

      <div className="sidebar-logo">
        <GraduationCap size={32} />
        <h2>ACE</h2>
      </div>

      {/* ================================= */}
      {/* MAIN NAVIGATION */}
      {/* ================================= */}

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

      {/* ================================= */}
      {/* UPLOADED NOTES */}
      {/* ================================= */}

      <div className="sidebar-notes">
        <div className="sidebar-section-title">
          <span>Your Notes</span>
        </div>

        {uploadedNotes.length === 0 ? (
          <div className="no-notes">
            <FileText size={18} />

            <span>No notes uploaded</span>
          </div>
        ) : (
          <div className="notes-list">
            {uploadedNotes.map((note, index) => (
              <div
                className="sidebar-note"
                key={`${note}-${index}`}
                title={note}
              >
                <FileText size={16} />

                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* BOTTOM SETTINGS */}
      {/* ================================= */}

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
