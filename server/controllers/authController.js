const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      usn,
      mobile,
      username,
      password,
      role,
      secretKey,
    } = req.body;

    // 🔐 Warden check
    if (role === "warden") {
      if (secretKey !== process.env.WARDEN_SECRET_KEY) {
        return res.status(403).json({ message: "Invalid secret key" });
      }

      const existingWarden = await User.findOne({ role: "warden" });
      if (existingWarden) {
        return res.status(400).json({ message: "Warden already exists" });
      }
    }

    // 🔐 Password must be exactly 6-digit numeric
    if (!/^\d{6}$/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must be exactly a 6-digit number (e.g., 123456)." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      usn,
      mobile,
      username,
      password: hashedPassword,
      role: role || "student",
    });

    res.json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) {
      const field = error.keyValue ? Object.keys(error.keyValue)[0] : "field";
      return res.status(400).json({ message: `An account with that ${field} already exists.` });
    }
    res.status(500).json({ message: error.message || "Unknown Registration Error" });
  }
};

// STUDENT LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WARDEN LOGIN
exports.wardenLogin = async (req, res) => {
  try {
    const { secretKey } = req.body;

    // Check against .env WARDEN_SECRET_KEY
    if (secretKey !== process.env.WARDEN_SECRET_KEY) {
      return res.status(400).json({ message: "Invalid Secret Key" });
    }

    // Try finding an existing warden
    let warden = await User.findOne({ role: "warden" });

    // If no warden exists yet, we generate a placeholder record so we can assign ownership/auth
    if (!warden) {
      // Create an impossible-to-guess password since this account is locked to secretKey
      const fakeHashedPass = await bcrypt.hash(Date.now().toString() + Math.random(), 10);
      warden = await User.create({
        name: "Chief Warden",
        usn: "WARDEN_SYS",
        mobile: "N/A",
        username: "warden_admin",
        password: fakeHashedPass,
        role: "warden",
      });
    }

    res.json({
      _id: warden._id,
      name: warden.name,
      username: warden.username,
      role: warden.role,
      token: generateToken(warden._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ACCOUNT (Student only)
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "warden") {
      return res.status(403).json({ message: "Warden accounts cannot be deleted directly" });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "User account deleted successfully. Issues persist." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: error.message });
  }
};