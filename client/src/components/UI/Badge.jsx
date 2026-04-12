import React from 'react';

const Badge = ({ children, variant = "neutral", style: customStyle, ...props }) => {
  const styles = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "var(--radius-full)",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const variants = {
    neutral: {
      background: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-glass)",
    },
    success: {
      background: "rgba(16, 185, 129, 0.15)",
      color: "var(--accent-success)",
      border: "1px solid rgba(16, 185, 129, 0.3)",
    },
    danger: {
      background: "rgba(239, 68, 68, 0.15)",
      color: "var(--accent-danger)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
    },
    primary: {
      background: "rgba(99, 102, 241, 0.15)",
      color: "var(--accent-primary)",
      border: "1px solid rgba(99, 102, 241, 0.3)",
    }
  };

  return (
    <span style={{ ...styles, ...variants[variant], ...customStyle }} {...props}>
      {children}
    </span>
  );
};

export default Badge;
