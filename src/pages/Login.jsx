import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";

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

  const inputClass =
    "mt-1 mb-4 w-full rounded bg-cream/60 border border-sage/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sand";

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage/30 p-4">
      <div className="grid md:grid-cols-2 w-full max-w-5xl md:h-[28rem] rounded-xl overflow-hidden shadow-xl">
        {/* Left panel: illustration */}
        <div className="hidden md:flex items-center justify-center bg-white p-8">
          <img
            src="/login-illustration.svg"
            alt="Students learning"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Right panel: form */}
        <div className="flex flex-col items-center justify-center bg-cream p-8">
          <h2 className="text-3xl text-forest font-semibold">Zinger School</h2>
          <p className="text-sm text-forest/70 mt-1">
            Hey, enter your details to sign in to your account
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full max-w-xs bg-white rounded-md p-5 shadow-sm"
          >
            <label className="block text-xs text-forest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={inputClass}
              required
            />

            <div className="flex justify-between text-xs text-forest">
              <label>Password</label>
              <a href="#" className="text-sage hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full rounded bg-forest text-cream py-2 text-sm font-medium hover:bg-sage transition-colors"
            >
              Login
            </button>

            <p className="text-xs text-center text-forest/70 mt-4">
              Don't have an account?{" "}
              <a href="#" className="text-sage font-medium hover:underline">
                Create new account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}