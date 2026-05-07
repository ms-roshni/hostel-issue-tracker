const Issue = require("../models/Issue");

// ✅ CREATE ISSUE (student)
exports.createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      floor,
      roomNumber,
      issueDate,
      imageUrl,
    } = req.body;

    // 🔥 Basic validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!issueDate) {
      return res.status(400).json({ message: "Issue Date is required" });
    }

    const numericFloor = Number(floor);
    if (!numericFloor || numericFloor < 1 || numericFloor > 8) {
      return res.status(400).json({ message: "Floor must be between 1 and 8." });
    }

    const numericRoom = Number(roomNumber);
    if (!numericRoom || numericRoom < 1 || numericRoom > 13) {
      return res.status(400).json({ message: "Room number must be between 1 and 13." });
    }

    const validCategories = ["plumbing", "electrical", "hardware", "food", "other"];
    const safeCategory = validCategories.includes(category) ? category : "other";

    const issue = await Issue.create({
      title,
      description,
      category: safeCategory,
      floor: numericFloor,
      roomNumber: numericRoom,
      issueDate: new Date(issueDate),
      createdBy: req.user._id,
      image: imageUrl || null,
    });

    res.json(issue);
  } catch (error) {
    console.error("CREATE ISSUE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL ISSUES (warden)
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ isArchived: false })
      .populate("createdBy", "name roomNumber floor")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("GET ALL ISSUES ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET MY ISSUES (student)
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      createdBy: req.user._id,
      isArchived: false,
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("GET MY ISSUES ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE STATUS (warden)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    // 🔥 Only allow valid statuses
    if (status && !["pending", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updates = {};
    if (status) updates.status = status;
    if (remarks !== undefined) updates.remarks = remarks;

    const result = await Issue.updateOne({ _id: req.params.id }, { $set: updates });
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Status updated bypass successful" });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ VERIFY ISSUE (student)
exports.verifyIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to verify this issue",
      });
    }

    const newValue = !issue.studentVerified;
    const verifiedAtValue = newValue ? new Date() : null;

    await Issue.updateOne(
      { _id: req.params.id }, 
      { $set: { studentVerified: newValue, verifiedAt: verifiedAtValue } }
    );
    
    res.json({ message: "Verification status toggled successfully", studentVerified: newValue, verifiedAt: verifiedAtValue });
  } catch (error) {
    console.error("VERIFY ISSUE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ARCHIVE ISSUE (warden - soft delete)
exports.archiveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await Issue.updateOne({ _id: req.params.id }, { $set: { isArchived: true } });

    res.json({ message: "Issue archived successfully" });
  } catch (error) {
    console.error("ARCHIVE ISSUE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DOWNLOAD REPORT (warden)
const { Parser } = require("json2csv");

exports.downloadReport = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);

    const issues = await Issue.find({
      status: "resolved",
      createdAt: { $gte: start },
    });

    const fields = ["roomNumber", "category", "createdAt"];
    const parser = new Parser({ fields });

    const csv = parser.parse(issues);

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    res.send(csv);
  } catch (error) {
    console.error("DOWNLOAD REPORT ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET PRESIGNED URL (student)
const { generateUploadURL } = require("../utils/s3");

exports.getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
      return res.status(400).json({ message: "Missing fileName or fileType" });
    }
    
    const { uploadUrl, fileUrl } = await generateUploadURL(fileName, fileType);
    
    res.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("PRESIGNED URL ERROR:", error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};