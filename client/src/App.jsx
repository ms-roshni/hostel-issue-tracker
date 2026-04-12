import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import Register from "./pages/Register";

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/warden" element={<WardenDashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;