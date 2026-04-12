import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../UI/Button';
import ThemeToggle from '../UI/ThemeToggle';

const Navbar = ({ role, onContactClick }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const confirmDeleteAccount = () => {
    if (role === "warden") return;
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      setDeleteModalOpen(false);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete account");
      setDeleteModalOpen(false);
    }
  };

  const username = localStorage.getItem("username") || "User";

  return (
    <nav 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-glass)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Left Elements */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle />
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: "1.2rem"
          }}>
            H
          </div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>HostelTrack</h2>
        </div>

        {/* Right Elements */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          
          {onContactClick && (
            <Button variant="secondary" onClick={onContactClick} style={{ padding: "6px 16px", fontWeight: "500" }}>
              Contact
            </Button>
          )}

          {role && (
            <div style={{ position: "relative" }}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: dropdownOpen ? "var(--bg-tertiary)" : "transparent",
                  border: "1px solid transparent",
                  transition: "all var(--transition-fast)"
                }}
                onMouseOver={(e) => {
                  if(!dropdownOpen) e.currentTarget.style.background = "var(--bg-glass)";
                }}
                onMouseOut={(e) => {
                  if(!dropdownOpen) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "var(--accent-primary)", display: "flex",
                  alignItems: "center", justifyContent: "center", color: "white", 
                  fontWeight: "bold", fontSize: "0.85rem"
                }}>
                  {username.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: "500", fontSize: "0.95rem" }}>{username}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                  {dropdownOpen ? "▲" : "▼"}
                </span>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="glass-panel animate-fade-in" style={{
                  position: "absolute",
                  top: "120%", right: 0,
                  width: "160px",
                  padding: "8px 0",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-glass)", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Panel</span>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem", textTransform: "capitalize" }}>{role}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: "transparent", border: "none", color: "var(--text-primary)",
                      padding: "10px 16px", textAlign: "left", cursor: "pointer",
                      fontWeight: "500", fontSize: "0.9rem", width: "100%",
                      transition: "background var(--transition-fast)"
                    }}
                    onMouseOver={e => e.target.style.background = "var(--bg-glass)"}
                    onMouseOut={e => e.target.style.background = "transparent"}
                  >
                    Logout
                  </button>
                  
                  {role === "student" && (
                    <button 
                      onClick={confirmDeleteAccount}
                      style={{
                        background: "transparent", border: "none", color: "var(--accent-danger)",
                        padding: "10px 16px", textAlign: "left", cursor: "pointer",
                        fontWeight: "500", fontSize: "0.9rem", width: "100%",
                        transition: "background var(--transition-fast)"
                      }}
                      onMouseOver={e => e.target.style.background = "rgba(239, 68, 68, 0.1)"}
                      onMouseOut={e => e.target.style.background = "transparent"}
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div 
          onClick={() => setDeleteModalOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(8px)"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel animate-fade-in"
            style={{
              padding: "40px",
              maxWidth: "450px",
              width: "90%",
              textAlign: "center"
            }}
          >
            <h2 style={{ marginBottom: "12px", fontSize: "1.5rem", color: "var(--text-primary)" }}>Delete Account?</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "0.95rem", lineHeight: "1.5" }}>
              Are you sure you want to permanently delete your account? You will lose access immediately, but your existing infrastructure reports will remain visible to Wardens.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button 
                onClick={executeDelete}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--accent-danger)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "1rem"
                }}
              >
                YES
              </button>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--accent-success)",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "1rem"
                }}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
