import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

function Register() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    mobile: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://hostel-issue-tracker-1d9f.onrender.com/api/auth/register", form);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Try again.");
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
          <h1>Create Account</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join HostelTrack as a Student</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div style={{ 
              background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "var(--accent-danger)", padding: "12px", borderRadius: "var(--radius-sm)",
              fontSize: "0.9rem", textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <Input label="Full Name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          <Input label="USN" name="usn" type="text" placeholder="1XY23CS001" value={form.usn} onChange={handleChange} required />
          <Input label="Mobile" name="mobile" type="text" placeholder="9876543210" value={form.mobile} onChange={handleChange} required />
          <Input label="Username" name="username" type="text" placeholder="johndoe123" value={form.username} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" placeholder="Exactly 6 digits (e.g. 123456)" value={form.password} onChange={handleChange} required />

          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px", padding: "14px" }}>
            Sign Up
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/" style={{ fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;