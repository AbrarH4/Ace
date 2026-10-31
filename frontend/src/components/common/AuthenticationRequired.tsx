import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
type AuthRequiredProps = {
  children: React.ReactNode;
};

function AuthRequired({ children }: AuthRequiredProps) {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/notes", {
          credentials: "include",
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Still checking
  if (isAuthenticated === null) {
    return (
      <div key={"auth-check"} className="AUTHENTICATION CHECK">
        Checking authentication...
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-required-card">
          <div className="auth-required-icon">
            <LockKeyhole size={28} />
          </div>

          <span className="auth-required-eyebrow">Authentication required</span>

          <h2>Welcome back</h2>

          <p>
            You need to be signed in to access this part of ACE. Log in to
            continue where you left off.
          </p>

          <div className="auth-required-actions">
            <button
              className="auth-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
              <ArrowRight size={17} />
            </button>

            <button
              className="auth-register-btn"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>
          </div>

          <div className="auth-required-footer">
            <ShieldCheck size={15} />
            <span>Your notes and learning data stay private.</span>
          </div>
        </div>
      </div>
    );
  }

  // Logged in → show the protected page
  return <>{children}</>;
}

export default AuthRequired;
