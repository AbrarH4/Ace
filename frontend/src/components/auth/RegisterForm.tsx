import { useState, type SubmitEvent } from "react";
// @ts-expect-error - CSS imports are handled by the bundler
import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
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
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.detail);
        return;
      }

      showMessage("✓  Account created successfully! 🎉");
      setFullName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      showMessage("✕  Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <p>Start learning smarter with ACE.</p>

      <input
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />

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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
      {message && <div className="form-message">{message}</div>}
    </form>
  );
}

export default RegisterForm;
