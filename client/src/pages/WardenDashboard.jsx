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

  // Filters
  const [floorFilter, setFloorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const [groupedIssues, setGroupedIssues] = useState({});

  const token = localStorage.getItem("token");

  const fetchIssues = async () => {
    try {
      const res = await axios.get("https://hostel-issue-tracker-1d9f.onrender.com/api/issues", {
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


  // Actions
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "resolved" : "pending";
    try {
      await axios.put(`https://hostel-issue-tracker-1d9f.onrender.com/api/issues/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
    } catch (error) {
      console.error(error);
    }
  };

  const archiveIssue = async (id) => {
    if(!window.confirm("Are you sure you want to remove this completed issue?")) return;
    try {
      await axios.put(`https://hostel-issue-tracker-1d9f.onrender.com/api/issues/${id}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIssues();
    } catch (error) {
      console.error(error);
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
          <Button variant="primary" onClick={downloadReport}>
            <span style={{ marginRight: "8px" }}>📄</span> Download PDF Report
          </Button>
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
                    onArchive={() => archiveIssue(issue._id)}
                  />
                ))}
              </CollapsibleDateGroup>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default WardenDashboard;
