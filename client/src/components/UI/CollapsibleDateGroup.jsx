import React, { useState } from 'react';

const CollapsibleDateGroup = ({ dateStr, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          cursor: "pointer", 
          borderBottom: "1px solid var(--border-glass)", 
          paddingBottom: "8px", 
          marginBottom: isCollapsed ? "0" : "16px",
          transition: "margin 0.3s ease"
        }}
      >
        <h4 style={{ color: "var(--text-secondary)", margin: 0 }}>
          {dateStr}
        </h4>
        <span style={{ 
          color: "var(--text-muted)", 
          transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)", 
          transition: "transform 0.3s ease",
          fontSize: "1.2rem",
          display: "inline-block"
        }}>
          ▼
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleDateGroup;
