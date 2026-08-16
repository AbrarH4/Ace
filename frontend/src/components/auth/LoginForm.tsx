import { useState, type SubmitEvent } from "react";
// @ts-expect-error - CSS imports are handled by the bundler
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const showMessage = (text: string) => {
      setMessage(text);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.detail);
        return;
      }

      showMessage("✓  Login successful! 🎉");
      setTimeout(() => {
        (navigate("/chat"), 2000);
      });

      setEmail("");
      setPassword("");
    } catch (error) {
      showMessage("✕  Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>

      <p>Log in to continue learning with ACE.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging In..." : "Log In"}
      </button>

      {message && <div className="form-message">{message}</div>}
    </form>
  );
}

export default LoginForm;
