import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { useLanguage } from "../i18n/useLanguage";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import loginIllustration from "../assets/login-illustration.png";
import "../styles/login.css";

export default function Login() {
  const { tr } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      setError(
        tr(
          "Incorrect email or password. Check your spelling or choose a demo account below.",
          "E-Mail oder Passwort ist falsch. Prüfen Sie Ihre Eingabe oder wählen Sie unten ein Demo-Konto."
        )
      );
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    navigate(`/${user.role}`);
  };

  const fillDemo = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
    setHelpMessage("");
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-left">
          <div className="login-brand-row">
            <p className="login-brand">Zinger School</p>
            <LanguageSwitcher />
          </div>
          <div className="login-artwork">
            <img
              src={loginIllustration}
              alt={tr(
                "Students reading around a stack of books",
                "Schülerinnen und Schüler lesen rund um einen Bücherstapel"
              )}
              width="1307"
              height="980"
              className="login-img"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-content">
            <h1 id="login-title" className="login-title">
              {tr("School portal", "Schulportal")}
            </h1>
            <p className="login-subtitle">
              {tr("Sign in to your school account.", "Mit Ihrem Schulkonto anmelden.")}
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">
                  {tr("Email", "E-Mail")}
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr("example@email.com", "beispiel@email.com")}
                  className="login-input"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>

              <div className="login-field">
                <div className="login-row">
                  <label htmlFor="login-password" className="login-label">
                    {tr("Password", "Passwort")}
                  </label>
                  <button
                    type="button"
                    className="login-link"
                    onClick={() =>
                      setHelpMessage(
                        tr(
                          "Passwords are managed by your school office. Ask Mrs. Radwa or select a quick demo account below.",
                          "Passwörter werden vom Schulsekretariat verwaltet. Fragen Sie Ihre Lehrkraft oder wählen Sie unten ein Demo-Konto."
                        )
                      )
                    }
                  >
                    {tr("Forgot password?", "Passwort vergessen?")}
                  </button>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="login-input"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>

              {error && (
                <p id="login-error" className="login-error" role="alert">
                  {error}
                </p>
              )}

              {helpMessage && (
                <p className="login-help-note" role="status">
                  {helpMessage}
                </p>
              )}

              <button type="submit" className="login-button">
                {tr("Sign in", "Anmelden")}
              </button>

              <p className="login-footer">
                {tr("Don't have an account?", "Noch kein Konto?")}{" "}
                <button
                  type="button"
                  className="login-link"
                  onClick={() =>
                    setHelpMessage(
                      tr(
                        "New student, parent, and teacher accounts are issued at enrollment. Pick any demo role below to explore right away.",
                        "Neue Schüler-, Eltern- und Lehrkräftekonten werden von der Schule vergeben. Wählen Sie unten eine Demo-Rolle zum Ausprobieren."
                      )
                    )
                  }
                >
                  {tr("Account help", "Kontohilfe")}
                </button>
              </p>

              <div className="login-demo">
                <h2 className="login-demo-title">
                  {tr("Quick demo", "Schnell-Demo")}
                </h2>
                <div className="login-demo-grid">
                  {users.map((demoUser) => (
                    <button
                      key={demoUser.email}
                      type="button"
                      onClick={() => fillDemo(demoUser)}
                      className="login-demo-button"
                    >
                      {demoUser.role === "student"
                        ? tr("Student (Ahmed)", "Schüler (Ahmed)")
                        : demoUser.role === "parent"
                          ? tr("Parent (Mr. Ehab)", "Eltern (Mr. Ehab)")
                          : tr("Teacher (Mrs. Radwa)", "Lehrkraft (Mrs. Radwa)")}
                    </button>
                  ))}
                </div>
                <p id="login-demo-student" className="login-demo-student">
                  {tr("Click any role to auto-fill email & password, then click Sign in.", "Rolle klicken, um E-Mail & Passwort auszufüllen, dann auf Anmelden klicken.")}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
