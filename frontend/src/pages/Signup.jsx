import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await signupUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Account created, but no login token was received.");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="casino-bg casino-bg-left">♣</div>
      <div className="casino-bg casino-bg-right">♥</div>

      <div className="auth-card">
        <div className="casino-chip">RB</div>

        <h1>Roulette Bank</h1>
        <p className="auth-tagline">Create your secure vault</p>

        <div className="roulette-strip">
          <span>●</span>
          <span>◆</span>
          <span>●</span>
          <span>◆</span>
          <span>●</span>
        </div>

        <h2>Create Account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;