import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
import loginIllustration from "../assets/login-illustration.png";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      setError("Incorrect email or password.");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    navigate(`/${user.role}`);
  };
return (
  <div className="login-page">
    <div className="login-card">
      <div className="login-left">
        <img src={loginIllustration} alt="Students learning" className="login-img" />
      </div>

      <div className="login-right">
        <h2 className="login-title">Zinger School</h2>
        <p className="login-subtitle">
          Hey, enter your details to sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="login-input"
            required
          />

          <div className="login-row">
            <label>Password</label>
            <a href="#" className="login-link">Forgot password?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">Login</button>

          <p className="login-footer">
            Don't have an account?{" "}
            <a href="#" className="login-link">Create new account</a>
          </p>
        </form>
      </div>
    </div>
  </div>
);}