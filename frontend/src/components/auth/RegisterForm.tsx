import { useState, type SubmitEvent } from "react";
// @ts-expect-error - CSS imports are handled by the bundler
import "./RegisterForm.css";

function RegisterForm() {
  const [firstName, setFirstName] = useState("");
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
          firstName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        showMessage("ERROR: REGISTRATION FAILED!");
        return;
      }

      showMessage("ACCOUNT CREATED SUCCESFULLY!");
    } catch (error) {
      showMessage("ACCOUNT CREATION FAILED DUE TO INTERNAL ERROR!");
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
        placeholder="First name"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
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
