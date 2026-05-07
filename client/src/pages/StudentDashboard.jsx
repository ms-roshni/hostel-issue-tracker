import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Layout/Navbar";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";
import Button from "../components/UI/Button";
import IssueCard from "../components/UI/IssueCard";
import CollapsibleDateGroup from "../components/UI/CollapsibleDateGroup";

function StudentDashboard() {
  const [allFetchedIssues, setAllFetchedIssues] = useState([]);
  const [issues, setIssues] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState("my"); // "my" or "all"

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [floor, setFloor] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState(null);
  
  const [formError, setFormError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  
  // Extract user ID from token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch(e) { return null; }
  };
  const currentUserId = token ? parseJwt(token).id : null;

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFetchedIssues(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and group issues whenever data or filter changes
  useEffect(() => {
    const grouped = {};
    
    const filteredIssues = allFetchedIssues.filter(issue => {
      if (viewFilter === "all") return true;
      // For "my", ensure createdBy matches currentUserId
      const creatorId = typeof issue.createdBy === 'object' ? issue.createdBy?._id : issue.createdBy;
      return creatorId === currentUserId;
    });

    filteredIssues.forEach((issue) => {
      const dateObj = new Date(issue.issueDate || issue.createdAt);
      const dateKey = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(issue);
    });

    setIssues(grouped);
  }, [allFetchedIssues, viewFilter, currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitLoading(true);
    
    try {
      let imageUrl = null;

      if (image) {
        // 1. Get pre-signed URL from our backend
        const presignedRes = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues/presigned-url`, {
          params: { fileName: image.name, fileType: image.type },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { uploadUrl, fileUrl } = presignedRes.data;

        // 2. Upload the file directly to S3
        await axios.put(uploadUrl, image, {
          headers: {
            "Content-Type": image.type,
          },
        });

        imageUrl = fileUrl;
      }

      // 3. Submit issue details to backend
      const payload = {
        title,
        description,
        category,
        floor: Number(floor),
        roomNumber: Number(roomNumber),
        issueDate,
        imageUrl
      };

      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // reset form
      setTitle("");
      setDescription("");
      setFloor("");
      setRoomNumber("");
      setCategory("other");
      setImage(null);
      if(fileInputRef.current) fileInputRef.current.value = "";

      fetchIssues(); // Refresh feed
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to submit issue");
    } finally {
      setSubmitLoading(false);
    }
  };

  const verifyIssue = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong verifying this issue.");
      console.error(error);
    }
  };

  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const categoryOptions = [
    { value: "other", label: "Other" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hardware", label: "Hardware" },
    { value: "food", label: "Food" },
  ];

  return (
    <>
      <style>{`
        /* Bulletproof Dashboard Responsive Layout */
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
          padding-bottom: 80px;
          position: relative;
        }
        
        .dashboard-form-panel {
          flex: none;
          position: static !important; /* Force disable sticky on mobile */
          height: auto;
          width: 100%;
          z-index: 10;
        }
        
        .dashboard-feed-panel {
          flex: none;
          position: static;
          width: 100%;
          z-index: 5;
        }

        /* Desktop Layout */
        @media (min-width: 992px) {
          .dashboard-wrapper {
            flex-direction: row;
            align-items: flex-start;
          }
          .dashboard-form-panel {
            flex: 0 0 400px;
            position: sticky !important;
            top: 100px;
          }
          .dashboard-feed-panel {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>
      <Navbar role="student" onContactClick={() => setContactModalOpen(true)} />
      
      {/* Hero Section */}
      <div style={{
        padding: "140px 20px 40px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
        animation: "fadeIn var(--transition-normal) forwards"
      }}>
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 5vw, 4rem)", 
          fontWeight: "800", 
          lineHeight: "1.1",
          background: "linear-gradient(135deg, var(--text-primary), var(--accent-primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px"
        }}>
          Seamlessly Manage Your Hostel Life.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "30px", maxWidth: "600px", margin: "0 auto" }}>
          Report infrastructure issues, track maintenance progress, and instantly connect with Chief Wardens to resolve blocking complications.
        </p>
      </div>

      <div className="container dashboard-wrapper">
        
        {/* Left Side: Form Panel */}
        <div className="glass-panel dashboard-form-panel" style={{ padding: "30px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Raise an Issue</h2>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {formError && (
              <div style={{ color: "var(--accent-danger)", fontSize: "0.9rem", padding: "8px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-sm)" }}>
                {formError}
              </div>
            )}

            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Leaking Tap" required />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", textTransform: "uppercase" }}>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Give more details..."
                required
                style={{
                  width: "100%", padding: "12px", background: "var(--bg-tertiary)", 
                  border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)", fontSize: "1rem", minHeight: "100px",
                  outline: "none", resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Input label="Room (1 to 13)" type="number" min="1" max="13" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="10" required />
              <Input label="Floor (1 to 8)" type="number" min="1" max="8" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="1" required />
              <Input label="Date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
            </div>

            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={categoryOptions} />

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", textTransform: "uppercase" }}>Attachment (Optional)</label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImage(e.target.files[0])}
                style={{ display: "none" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <label 
                  htmlFor="file-upload"
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    transition: "all var(--transition-fast)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseOver={e => e.target.style.background = "var(--bg-glass)"}
                  onMouseOut={e => e.target.style.background = "transparent"}
                >
                  📁 Choose File
                </label>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {image ? image.name : "No file attached"}
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" style={{ marginTop: "10px" }} disabled={submitLoading}>
              {submitLoading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </div>

        {/* Right Side: Feed Panel */}
        <div className="dashboard-feed-panel" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* Toggle Buttons */}
          <div style={{ display: "flex", gap: "10px", background: "var(--bg-glass)", padding: "6px", borderRadius: "var(--radius-lg)", width: "fit-content" }}>
            <button
              onClick={() => setViewFilter("my")}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: viewFilter === "my" ? "var(--accent-primary)" : "transparent",
                color: viewFilter === "my" ? "white" : "var(--text-secondary)",
                fontWeight: viewFilter === "my" ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              My Issues
            </button>
            <button
              onClick={() => setViewFilter("all")}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: viewFilter === "all" ? "var(--accent-primary)" : "transparent",
                color: viewFilter === "all" ? "white" : "var(--text-secondary)",
                fontWeight: viewFilter === "all" ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              All Issues
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading your issues...</div>
          ) : Object.keys(issues).length === 0 ? (
            <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>No issues raised yet.</h3>
              <p style={{ color: "var(--text-muted)" }}>When you submit an issue, you'll be able to track it here.</p>
            </div>
          ) : (
            Object.keys(issues).map((dateKey) => (
              <CollapsibleDateGroup key={dateKey} dateStr={dateKey}>
                {issues[dateKey].map(issue => (
                  <IssueCard 
                    key={issue._id} 
                    issue={issue} 
                    role="student" 
                    currentUserId={currentUserId}
                    onVerify={() => verifyIssue(issue._id)} 
                  />
                ))}
              </CollapsibleDateGroup>
            ))
          )}
          
        </div>

      </div>

      {/* Warden Contact Modal */}
      {isContactModalOpen && (
        <div 
          onClick={() => setContactModalOpen(false)}
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
              maxWidth: "400px",
              width: "90%",
              position: "relative",
              textAlign: "center"
            }}
          >
            <button 
              onClick={() => setContactModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "1.8rem",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.color = "var(--text-primary)"}
              onMouseOut={(e) => e.target.style.color = "var(--text-muted)"}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: "8px", fontSize: "1.5rem" }}>Warden Directory</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "0.95rem" }}>
              Please reach out directly only for urgent escalations.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ 
                background: "var(--bg-tertiary)", padding: "16px", 
                borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: "600" }}>Saraswati</span>
                <a href="tel:7760194401" style={{ fontWeight: "700", color: "var(--accent-primary)" }}>7760194401</a>
              </div>
              <div style={{ 
                background: "var(--bg-tertiary)", padding: "16px", 
                borderRadius: "var(--radius-md)", border: "1px solid var(--border-glass)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontWeight: "600" }}>Preethi</span>
                <a href="tel:9845964013" style={{ fontWeight: "700", color: "var(--accent-primary)" }}>9845964013</a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;