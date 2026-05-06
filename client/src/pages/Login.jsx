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
  const [successMsg, setSuccessMsg] = useState("");

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetUsn, setResetUsn] = useState("");
  const [resetMobile, setResetMobile] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/login`, { username, password });
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/warden-login`, { secretKey });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.name || "Warden");
      navigate("/warden");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid Secret Key");
    }
  };

  const handleResetCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/reset-credentials`, {
        usn: resetUsn,
        mobile: resetMobile,
        newUsername,
        newPassword
      });
      setSuccessMsg(res.data.message);
      setIsForgotMode(false);
      setUsername(newUsername);
      setPassword(newPassword);
      setResetUsn("");
      setResetMobile("");
      setNewUsername("");
      setNewPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset credentials");
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
        {!isForgotMode && (
          <div style={{ display: "flex", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", marginBottom: "24px", padding: "4px" }}>
            <button 
              type="button"
              onClick={() => { setActiveTab("student"); setError(""); setSuccessMsg(""); }}
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
              onClick={() => { setActiveTab("warden"); setError(""); setSuccessMsg(""); }}
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
        )}

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "var(--accent-danger)", padding: "12px", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", textAlign: "center", marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ 
            background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "var(--accent-success)", padding: "12px", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", textAlign: "center", marginBottom: "20px"
          }}>
            {successMsg}
          </div>
        )}

        {isForgotMode ? (
          <form onSubmit={handleResetCredentials} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
              Enter your USN and registered Mobile Number to verify your identity.
            </p>
            <Input label="USN" id="resetUsn" type="text" placeholder="Enter your USN" value={resetUsn} onChange={(e) => setResetUsn(e.target.value)} required />
            <Input label="Mobile Number" id="resetMobile" type="text" placeholder="Enter your registered mobile" value={resetMobile} onChange={(e) => setResetMobile(e.target.value)} required />
            <div style={{ height: "1px", background: "var(--border-glass)", margin: "10px 0" }}></div>
            <Input label="New Username" id="newUsername" type="text" placeholder="Enter new username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
            <Input label="New Password (6 digits)" id="newPassword" type="password" placeholder="Enter 6 digit code" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px", padding: "14px" }}>Reset Credentials</Button>
            <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.9rem" }}>
              <button type="button" onClick={() => { setIsForgotMode(false); setError(""); }} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}>Back to Login</button>
            </p>
          </form>
        ) : activeTab === "student" ? (
          <form onSubmit={handleStudentLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Input label="Username" id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input label="Password" id="password" type="password" placeholder="Enter your 6 digit code" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px", padding: "14px" }}>Sign In</Button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "0.9rem" }}>
              <button type="button" onClick={() => { setIsForgotMode(true); setError(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>Forgot Credentials?</button>
              <span style={{ color: "var(--text-secondary)" }}>New here? <Link to="/register" style={{ fontWeight: "600" }}>Register</Link></span>
            </div>
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