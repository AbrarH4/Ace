import { Link } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";
function Navigation_Bar() {
  return (
    <nav className="ace-navbar">
      <div className="nav-logo">ACE</div>

      <div className="nav-center">
        <Link to={ROUTES.CHAT}> Workspace </Link>
        <Link to={ROUTES.FLASHCARDS}> Flashcards </Link>
        <Link to={ROUTES.QUIZ}> Quiz </Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>

      <div className="nav-settings">
        <i className="bi bi-gear-fill"></i>
      </div>
    </nav>
  );
}

export default Navigation_Bar;
