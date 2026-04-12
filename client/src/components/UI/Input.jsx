import React from 'react';

const Input = ({ label, id, className = "", ...props }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
  };

  const labelStyle = {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-glass)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "1rem",
    transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
    outline: "none",
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input
        id={id}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent-primary)";
          e.target.style.boxShadow = "var(--shadow-glow)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-glass)";
          e.target.style.boxShadow = "none";
        }}
        {...props}
      />
    </div>
  );
};

export default Input;
