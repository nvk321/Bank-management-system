import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <div className="auth-center" style={{ background: 'linear-gradient(180deg,#eaf4ff, #f7fbff)' }}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>🏦</div>
          <h1 className="auth-title">Welcome to MyBank</h1>
          <div className="muted">Secure Login Portal</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', textAlign: 'center', fontWeight: 600 }}>{error}</p>}

          <button type="submit" className="btn">Login</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 14 }} className="muted">© {new Date().getFullYear()} MyBank. All Rights Reserved.</p>
      </div>
    </div>
  );
}
