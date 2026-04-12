import React from 'react';

const Button = ({ children, variant = "primary", className = "", style = {}, ...props }) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    borderRadius: "var(--radius-sm)",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    border: "1px solid transparent",
    outline: "none",
  };

  const variants = {
    primary: {
      background: "var(--accent-primary)",
      color: "white",
      boxShadow: "var(--shadow-md)",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-glass)",
    },
    danger: {
      background: "var(--accent-danger)",
      color: "white",
    },
    success: {
      background: "var(--accent-success)",
      color: "white",
    }
  };

  // Deep merge passed down styles explicitly so {...props} doesn't obliterate the defaults
  const combinedStyle = {
    ...baseStyles,
    ...variants[variant],
    ...style,
  };

  return (
    <button 
      style={combinedStyle} 
      className={`btn-${variant} ${className}`}
      onMouseOver={(e) => {
        if(variant === 'primary') e.target.style.background = "var(--accent-primary-hover)";
        if(variant === 'secondary') {
           e.target.style.background = "var(--bg-glass)";
           e.target.style.color = "var(--text-primary)";
        }
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') e.target.style.background = "var(--accent-primary)";
        if(variant === 'secondary') {
           e.target.style.background = "transparent";
           e.target.style.color = "var(--text-primary)";
        }
        e.target.style.transform = "translateY(0)";
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
