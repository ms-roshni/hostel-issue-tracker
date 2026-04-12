const express = require("express");

function unwrap(m) {
  // handle module.exports vs export default
  return m && m.default ? m.default : m;
}

const protectImport = require("../middleware/authMiddleware");
const authorizeRolesImport = require("../middleware/roleMiddleware");
const controllersImport = require("../controllers/issueController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const protect = unwrap(protectImport);
const authorizeRoles = unwrap(authorizeRolesImport);
const controllers = unwrap(controllersImport);

// helper to ensure we have functions
function ensureFn(fn, name) {
  if (typeof fn !== "function") {
    const msg = `Expected "${name}" to be a function but got ${typeof fn}. Check the exported value in its file.`;
    console.error(msg);
    throw new TypeError(msg);
  }
  return fn;
}

const {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
  verifyIssue,
  archiveIssue,
  downloadReport,
} = controllers || {};

// Validate controller exports
ensureFn(createIssue, "createIssue");
ensureFn(getMyIssues, "getMyIssues");
ensureFn(getAllIssues, "getAllIssues");
ensureFn(updateIssueStatus, "updateIssueStatus");
ensureFn(verifyIssue, "verifyIssue");
ensureFn(archiveIssue, "archiveIssue");
ensureFn(downloadReport, "downloadReport");

// Validate middleware exports
ensureFn(protect, "protect");
ensureFn(authorizeRoles, "authorizeRoles");

const router = express.Router();

// Get all issues (warden and students) - Move to top before /my to prevent routing conflict
router.get("/", protect, getAllIssues);

// Get issues for the logged-in user (students)
router.get("/my", protect, getMyIssues);

// Download report (warden only)
router.get("/report/download", protect, authorizeRoles("warden"), downloadReport);

// Create a new issue (students) - handling single image upload
router.post("/", protect, uploadMiddleware.single("image"), createIssue);

// Update issue status (warden only)
router.put("/:id", protect, authorizeRoles("warden"), updateIssueStatus);

// Verify issue (student)
router.put("/:id/verify", protect, verifyIssue);

// Archive issue (warden only)
router.put("/:id/archive", protect, authorizeRoles("warden"), archiveIssue);

module.exports = router;