import { useState, type SubmitEvent } from "react";
// @ts-expect-error - CSS imports are handled by the bundler in this project
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
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

      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
