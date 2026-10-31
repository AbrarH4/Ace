import { useEffect, useState } from "react";
// The stylesheet is handled by the bundler; TypeScript has no declaration for CSS imports.

import "./ProfileDetails.css";
import { API_URL } from "../../config/api";
import {
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
  BookOpen,
  Brain,
  Target,
} from "lucide-react";

type UserDetails = {
  full_name: string;
  email?: string;
  created_at?: string;
};

function ProfileDetails() {
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: UserDetails = await response.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your profile.");
      }
    };

    getDetails();
  }, []);

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-loader" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const initials = details.full_name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="profile-page">
      {/* Header */}
      <section className="profile-heading">
        <div>
          <p className="profile-eyebrow">YOUR ACE PROFILE</p>
          <h1>Welcome back, {details.full_name.split(" ")[0]}.</h1>
          <p>
            Your personal space for everything related to your learning journey.
          </p>
        </div>
      </section>

      {/* Main profile card */}
      <section className="profile-hero-card">
        <div className="profile-avatar">{initials}</div>

        <div className="profile-main-info">
          <h2>{details.full_name}</h2>

          {details.email && (
            <div className="profile-email">
              <Mail size={16} />
              <span>{details.email}</span>
            </div>
          )}

          <div className="profile-status">
            <span className="profile-status-dot" />
            Active ACE member
          </div>
        </div>

        <div className="profile-verified">
          <ShieldCheck size={18} />
          <span>Account verified</span>
        </div>
      </section>

      {/* Stats */}
      <section className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <strong>Notes</strong>
            <span>Your study material</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <Brain size={20} />
          </div>
          <div>
            <strong>Flashcards</strong>
            <span>Your revision tools</span>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">
            <Target size={20} />
          </div>
          <div>
            <strong>Quizzes</strong>
            <span>Your practice sessions</span>
          </div>
        </div>
      </section>

      {/* Account information */}
      <section className="profile-section">
        <div className="profile-section-header">
          <div>
            <p className="profile-eyebrow">ACCOUNT</p>
            <h2>Personal information</h2>
          </div>
        </div>

        <div className="profile-information-card">
          <div className="profile-information-row">
            <div className="information-icon">
              <User size={18} />
            </div>

            <div>
              <span className="information-label">Full name</span>
              <strong>{details.full_name}</strong>
            </div>
          </div>

          {details.email && (
            <div className="profile-information-row">
              <div className="information-icon">
                <Mail size={18} />
              </div>

              <div>
                <span className="information-label">Email address</span>
                <strong>{details.email}</strong>
              </div>
            </div>
          )}

          {details.created_at && (
            <div className="profile-information-row">
              <div className="information-icon">
                <CalendarDays size={18} />
              </div>

              <div>
                <span className="information-label">Member since</span>
                <strong>
                  {new Date(details.created_at).toLocaleDateString()}
                </strong>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom message */}
      <section className="profile-footer-card">
        <div className="profile-footer-icon">✦</div>

        <div>
          <h3>Keep learning.</h3>
          <p>ACE is here to help you turn your notes into knowledge.</p>
        </div>
      </section>
    </main>
  );
}

export default ProfileDetails;
