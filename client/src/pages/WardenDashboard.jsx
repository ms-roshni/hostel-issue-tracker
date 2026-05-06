import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Layout/Navbar";
import Select from "../components/UI/Select";
import Button from "../components/UI/Button";
import IssueCard from "../components/UI/IssueCard";
import CollapsibleDateGroup from "../components/UI/CollapsibleDateGroup";

function WardenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  
  // Students
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  // Confirmation Modal
  const [confirmArchiveId, setConfirmArchiveId] = useState(null);

  // Filters
  const [floorFilter, setFloorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const [groupedIssues, setGroupedIssues] = useState({});

  const token = localStorage.getItem("token");

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data);
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

  useEffect(() => {
    let temp = [...issues];
    if (floorFilter) temp = temp.filter((i) => i.floor === Number(floorFilter));
    if (categoryFilter) temp = temp.filter((i) => i.category === categoryFilter);
    setFilteredIssues(temp);

    const grouped = {};
    temp.forEach((issue) => {
      const dateObj = new Date(issue.issueDate || issue.createdAt);
      const dateKey = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(issue);
    });
    setGroupedIssues(grouped);
  }, [floorFilter, categoryFilter, issues]);


  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Actions
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "resolved" : "pending";
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
      showToast(newStatus === "resolved" ? "Issue marked as completed!" : "Issue reverted to pending.");
    } catch (error) {
      console.error(error);
      showToast("Failed to update status.");
    }
  };

  const requestArchiveIssue = (id) => {
    setConfirmArchiveId(id);
  };

  const executeArchiveIssue = async () => {
    if (!confirmArchiveId) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/issues/${confirmArchiveId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
      showToast("Issue removed successfully.");
    } catch (error) {
      console.error(error);
      showToast("Failed to remove issue.");
    } finally {
      setConfirmArchiveId(null);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentsList(res.data);
      setShowStudentsModal(true);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch active students.");
    }
  };

  const downloadReport = () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.text("Hostel Maintenance Report", 14, 20);
      
      const tableColumn = ["Title", "Category", "Status", "Floor", "Date"];
      const tableRows = [];

      filteredIssues.forEach(issue => {
        const issueData = [
          issue.title,
          issue.category,
          issue.status,
          issue.floor,
          new Date(issue.issueDate || issue.createdAt).toLocaleDateString()
        ];
        tableRows.push(issueData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] } // var(--accent-primary)
      });
      
      doc.save(`hostel-report-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Make sure you have internet connection for CDNs!");
    }
  };

  // Stats
  const totalPending = issues.filter(i => i.status === "pending").length;
  const resolvedUnverified = issues.filter(i => i.status === "resolved" && !i.studentVerified).length;
  
  const categoryCount = {};
  issues.forEach(i => { categoryCount[i.category] = (categoryCount[i.category] || 0) + 1; });
  const topComplaint = Object.keys(categoryCount).length > 0
    ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
    : "N/A";

  const floorOptions = [
    { value: "", label: "All Floors" },
    { value: "1", label: "Floor 1" },
    { value: "2", label: "Floor 2" },
    { value: "3", label: "Floor 3" },
    { value: "4", label: "Floor 4" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hardware", label: "Hardware" },
    { value: "food", label: "Food" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      <Navbar role="warden" />
      
      <div className="container page-content">
        
        {/* Top Header & Export */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>Warden Control Panel</h1>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>Manage and track all hostel maintenance requests.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="neutral" onClick={fetchStudents}>
              <span>👥</span> View Active Students
            </Button>
            <Button variant="primary" onClick={downloadReport}>
              <span style={{ marginRight: "8px" }}>📄</span> Download PDF Report
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid-auto-fit" style={{ marginBottom: "40px" }}>
          <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px" }}>Active Requests</span>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--accent-danger)", lineHeight: "1" }}>{totalPending}</div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Pending Warden Action</span>
          </div>

          <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px" }}>Verification Queue</span>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--accent-primary)", lineHeight: "1" }}>{resolvedUnverified}</div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Pending Student Verification</span>
          </div>

          <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px" }}>Top Issue Type</span>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-primary)", lineHeight: "1.2", textTransform: "capitalize" }}>{topComplaint}</div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Based on historical data</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel" style={{ display: "flex", gap: "20px", padding: "16px 24px", marginBottom: "30px", alignItems: "flex-end", flexWrap: "wrap" }}>
          
          {/* Custom Floor Dropdown */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", textTransform: "uppercase" }}>Filter by Floor</span>
            <div 
              onClick={() => setFloorDropdownOpen(!floorDropdownOpen)}
              style={{
                padding: "10px 16px", background: floorDropdownOpen ? "var(--bg-glass)" : "transparent",
                color: "var(--text-primary)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", fontSize: "0.95rem", fontWeight: "500", transition: "all var(--transition-fast)",
                display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "160px"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--bg-glass)"}
              onMouseOut={e => { if(!floorDropdownOpen) e.currentTarget.style.background = "transparent" }}
            >
              {floorFilter ? `Floor ${floorFilter}` : "All Floors"}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{floorDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {floorDropdownOpen && (
              <div className="glass-panel animate-fade-in" style={{ position: "absolute", top: "100%", left: 0, marginTop: "8px", width: "100%", padding: "8px 0", zIndex: 10, display: "flex", flexDirection: "column" }}>
                {floorOptions.map((opt, i) => (
                  <button key={i} onClick={() => { setFloorFilter(opt.value); setFloorDropdownOpen(false); }}
                    style={{ background: opt.value === floorFilter ? "var(--bg-glass)" : "transparent", border: "none", color: "var(--text-primary)", padding: "10px 16px", textAlign: "left", cursor: "pointer", fontSize: "0.9rem", transition: "background var(--transition-fast)" }}
                    onMouseOver={e => e.target.style.background = "var(--bg-glass)"} onMouseOut={e => { if(opt.value !== floorFilter) e.target.style.background = "transparent" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Category Dropdown */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", textTransform: "uppercase" }}>Filter by Category</span>
            <div 
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              style={{
                padding: "10px 16px", background: categoryDropdownOpen ? "var(--bg-glass)" : "transparent",
                color: "var(--text-primary)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", fontSize: "0.95rem", fontWeight: "500", transition: "all var(--transition-fast)",
                display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "200px"
              }}
              onMouseOver={e => e.currentTarget.style.background = "var(--bg-glass)"}
              onMouseOut={e => { if(!categoryDropdownOpen) e.currentTarget.style.background = "transparent" }}
            >
              {categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : "All Categories"}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{categoryDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {categoryDropdownOpen && (
              <div className="glass-panel animate-fade-in" style={{ position: "absolute", top: "100%", left: 0, marginTop: "8px", width: "100%", padding: "8px 0", zIndex: 10, display: "flex", flexDirection: "column" }}>
                {categoryOptions.map((opt, i) => (
                  <button key={i} onClick={() => { setCategoryFilter(opt.value); setCategoryDropdownOpen(false); }}
                    style={{ background: opt.value === categoryFilter ? "var(--bg-glass)" : "transparent", border: "none", color: "var(--text-primary)", padding: "10px 16px", textAlign: "left", cursor: "pointer", fontSize: "0.9rem", transition: "background var(--transition-fast)" }}
                    onMouseOver={e => e.target.style.background = "var(--bg-glass)"} onMouseOut={e => { if(opt.value !== categoryFilter) e.target.style.background = "transparent" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ flexGrow: 1, textAlign: "right", color: "var(--text-muted)", fontSize: "0.9rem", paddingBottom: "12px" }}>
            Showing {filteredIssues.length} issues
          </div>
        </div>

        {/* Issue Feed */}
        {loading ? (
           <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading requests...</div>
        ) : filteredIssues.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", background: "var(--bg-glass)", borderRadius: "var(--radius-lg)" }}>
            No issues match your current filters.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {Object.keys(groupedIssues).map((dateKey) => (
              <CollapsibleDateGroup key={dateKey} dateStr={dateKey}>
                {groupedIssues[dateKey].map((issue) => (
                  <IssueCard 
                    key={issue._id}
                    issue={issue}
                    role="warden"
                    onToggle={() => toggleStatus(issue._id, issue.status)}
                    onArchive={() => requestArchiveIssue(issue._id)}
                  />
                ))}
              </CollapsibleDateGroup>
            ))}
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="animate-fade-in" style={{
          position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          background: "var(--accent-primary)", color: "white", padding: "12px 24px",
          borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", zIndex: 9999,
          fontWeight: "500", letterSpacing: "0.5px"
        }}>
          {toastMsg}
        </div>
      )}

      {/* Active Students Modal */}
      {showStudentsModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 5000
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: "90%", maxWidth: "800px", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Active Students ({studentsList.length})</h2>
              <button onClick={() => setShowStudentsModal(false)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            <div style={{ padding: "24px", overflowY: "auto" }}>
              {studentsList.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No active students found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-glass)", color: "var(--text-secondary)" }}>
                      <th style={{ padding: "12px 8px" }}>Name</th>
                      <th style={{ padding: "12px 8px" }}>USN</th>
                      <th style={{ padding: "12px 8px" }}>Phone No.</th>
                      <th style={{ padding: "12px 8px" }}>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsList.map(student => (
                      <tr key={student._id} style={{ borderBottom: "1px solid var(--border-glass)" }}>
                        <td style={{ padding: "12px 8px", fontWeight: "500" }}>{student.name}</td>
                        <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>{student.usn}</td>
                        <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>{student.mobile}</td>
                        <td style={{ padding: "12px 8px", color: "var(--text-primary)" }}>{student.username}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmArchiveId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 6000
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: "90%", maxWidth: "400px", padding: "30px 24px", textAlign: "center" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", color: "var(--text-primary)" }}>Confirm Eviction</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>Are you sure you want to remove this issue? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Button variant="neutral" onClick={() => setConfirmArchiveId(null)}>Cancel</Button>
              <Button variant="danger" onClick={executeArchiveIssue}>Confirm Remove</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WardenDashboard;
