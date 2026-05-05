import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const data = await loginUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Login worked, but no token was received.");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="casino-bg casino-bg-left">♠</div>
      <div className="casino-bg casino-bg-right">♦</div>

      <div className="auth-card">
        <div className="casino-chip">RB</div>

        <h1>Roulette Bank</h1>
        <p className="auth-tagline">Secure Sepolia banking with casino energy</p>

        <div className="roulette-strip">
          <span>●</span>
          <span>◆</span>
          <span>●</span>
          <span>◆</span>
          <span>●</span>
        </div>

        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
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
            {loading ? "Opening Vault..." : "Open the Vault"}
          </button>
        </form>

        <p>
          New player? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;