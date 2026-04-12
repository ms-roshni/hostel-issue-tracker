import React from 'react';

const Select = ({ label, id, options = [], className = "", ...props }) => {
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
    textTransform: "uppercase"
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-glass)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "1rem",
    appearance: "none",
    outline: "none",
    cursor: "pointer",
    transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <div style={{ position: "relative" }}>
        <select
          id={id}
          style={selectStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent-primary)";
            e.target.style.boxShadow = "var(--shadow-glow)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-glass)";
            e.target.style.boxShadow = "none";
          }}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron Array */}
        <div style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "var(--text-secondary)"
        }}>
          ▼
        </div>
      </div>
    </div>
  );
};

export default Select;
