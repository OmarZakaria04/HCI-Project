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
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-left">
          <p className="login-brand">Zinger School</p>
          <div className="login-artwork">
            <img
              src={loginIllustration}
              alt="Students reading around a stack of books"
              width="1307"
              height="980"
              className="login-img"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-content">
            <h1 id="login-title" className="login-title">School portal</h1>
            <p className="login-subtitle">Sign in to your school account.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">Email</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="login-input"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>

              <div className="login-field">
                <div className="login-row">
                  <label htmlFor="login-password" className="login-label">Password</label>
                  <a href="#" className="login-link">Forgot password?</a>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>

              {error && <p id="login-error" className="login-error" role="alert">{error}</p>}

              <button type="submit" className="login-button">Sign in</button>

              <p className="login-footer">
                Don't have an account?{" "}
                <a href="#" className="login-link">Create new account</a>
              </p>

              <div className="login-demo">
                <h2 className="login-demo-title">Quick demo</h2>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("ahmed@zinger.edu");
                    setPassword("student123");
                    setError("");
                  }}
                  className="login-demo-button"
                  aria-describedby="login-demo-student"
                >
                  Use student demo
                </button>
                <p id="login-demo-student" className="login-demo-student">Ahmed Ehab</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
