const express = require("express");
const router = express.Router();

const protectImport = require("../middleware/authMiddleware");
const protect = protectImport && protectImport.default ? protectImport.default : protectImport;

const { register, login, wardenLogin, deleteUserAccount } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/warden-login", wardenLogin);
router.delete("/me", protect, deleteUserAccount);

module.exports = router;