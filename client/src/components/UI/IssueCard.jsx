import React, { useState } from 'react';
import Badge from './Badge';
import Button from './Button';

const IssueCard = ({ issue, role, currentUserId, onVerify, onToggle, onArchive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if it's pending, resolved (unverified), or resolved (verified)
  const isPending = issue.status === "pending";
  const isResolvedUnverified = issue.status === "resolved" && !issue.studentVerified;
  const isVerified = issue.studentVerified;

  let statusVariant = "neutral";
  let statusText = "Unknown";

  if (isPending) {
    statusVariant = "danger";
    statusText = "Pending";
  } else if (isResolvedUnverified) {
    statusVariant = "primary";
    statusText = "Resolved (Verify Pending)";
  } else if (isVerified) {
    statusVariant = "success";
    statusText = "Completed";
  }

  const dateStr = new Date(issue.createdAt).toLocaleDateString("en-IN", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <>
      <div className="glass-panel animate-fade-in" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Header Area */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.25rem" }}>{issue.title}</h3>
            <Badge variant={statusVariant}>{statusText}</Badge>
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{dateStr}</span>
        </div>

        {/* Details Row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", margin: "8px 0" }}>
          <Badge variant="neutral">Room {issue.roomNumber}</Badge>
          <Badge variant="neutral">Floor {issue.floor}</Badge>
          <Badge variant="neutral">{issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}</Badge>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flexGrow: 1 }}>
          {issue.description || "No description provided."}
        </p>

        {/* Image Preview if exists */}
        {issue.image && (
          <div 
            style={{
              height: "150px",
              width: "100%",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              border: "1px solid var(--border-glass)",
              cursor: "pointer"
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <img 
              src={`https://hostel-issue-tracker-1d9f.onrender.com${issue.image}`} 
              alt="Issue attached" 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--transition-normal)" }} 
              onMouseOver={e => e.target.style.transform = "scale(1.05)"}
              onMouseOut={e => e.target.style.transform = "scale(1)"}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          
          {/* Student View Options */}
          {role === "student" && issue.status === "resolved" && (
            // Only show verify button if they are the actual creator
            ((typeof issue.createdBy === 'object' ? issue.createdBy?._id === currentUserId : issue.createdBy === currentUserId) || !currentUserId) && (
              <Button variant={isVerified ? "warning" : "success"} onClick={onVerify}>
                {isVerified ? "Mark as Unverified" : "Mark as Verified"}
              </Button>
            )
          )}

          {/* Warden View Options */}
          {role === "warden" && (
            <>
              {isPending ? (
                <Button variant="success" onClick={onToggle}>Mark as Completed</Button>
              ) : (
                <Button variant="warning" onClick={onToggle}>Revert to Pending</Button>
              )}

              {isVerified && (
                <Button variant="danger" onClick={onArchive}>Remove Issue</Button>
              )}
            </>
          )}
        </div>

      </div>

      {/* Full Screen Image Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(5px)"
          }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              background: "transparent",
              color: "white",
              border: "none",
              fontSize: "3rem",
              fontWeight: "300",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.2)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            &times;
          </button>
          <img 
            src={`https://hostel-issue-tracker-1d9f.onrender.com${issue.image}`} 
            alt="Expanded view" 
            style={{ 
              maxWidth: "90vw", 
              maxHeight: "90vh", 
              objectFit: "contain", 
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default IssueCard;
