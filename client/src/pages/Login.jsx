import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

function Login() {
  const [activeTab, setActiveTab] = useState("student"); // 'student' or 'warden'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://hostel-issue-tracker-1d9f.onrender.com/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.name);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid username or password");
    }
  };

  const handleWardenLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://hostel-issue-tracker-1d9f.onrender.com/api/auth/warden-login", { secretKey });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.name || "Warden");
      navigate("/warden");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid Secret Key");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px 30px",
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ 
            width: "50px", height: "50px", 
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px auto",
            fontSize: "1.5rem", fontWeight: "bold",
            color: "white"
          }}>
            H
          </div>
          <h1>HostelTrack</h1>
          <p style={{ color: "var(--text-secondary)" }}>Sign in to continue</p>
        </div>

        {/* Custom Tabs */}
        <div style={{ display: "flex", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", marginBottom: "24px", padding: "4px" }}>
          <button 
            type="button"
            onClick={() => { setActiveTab("student"); setError(""); }}
            style={{ 
              flex: 1, padding: "8px 0", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "600",
              background: activeTab === "student" ? "var(--accent-primary)" : "transparent",
              color: activeTab === "student" ? "white" : "var(--text-secondary)",
              transition: "all var(--transition-fast)"
            }}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("warden"); setError(""); }}
            style={{ 
              flex: 1, padding: "8px 0", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "600",
              background: activeTab === "warden" ? "var(--bg-secondary)" : "transparent",
              color: activeTab === "warden" ? "var(--accent-primary)" : "var(--text-secondary)",
              transition: "all var(--transition-fast)"
            }}
          >
            Warden
          </button>
        </div>

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "var(--accent-danger)", padding: "12px", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", textAlign: "center", marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        {activeTab === "student" ? (
          <form onSubmit={handleStudentLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Input label="Username" id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input label="Password" id="password" type="password" placeholder="Enter your 6 digit code" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px", padding: "14px" }}>Sign In</Button>
            <p style={{ textAlign: "center", marginTop: "12px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: "600" }}>Register here</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleWardenLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Input label="Secret Key" id="secretKey" type="password" placeholder="Enter Warden ID/Secret Key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required />
            <Button type="submit" variant="secondary" style={{ width: "100%", marginTop: "10px", padding: "14px", background: "var(--bg-secondary)", borderColor: "var(--accent-primary)" }}>Access Dashboard</Button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;