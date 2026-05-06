const express = require("express");
const router = express.Router();

const protectImport = require("../middleware/authMiddleware");
const protect = protectImport && protectImport.default ? protectImport.default : protectImport;
const authorizeRoles = require("../middleware/roleMiddleware");

const { register, login, wardenLogin, deleteUserAccount, getAllStudents, resetCredentials } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/warden-login", wardenLogin);
router.post("/reset-credentials", resetCredentials);
router.delete("/me", protect, deleteUserAccount);
router.get("/students", protect, authorizeRoles("warden"), getAllStudents);

module.exports = router;