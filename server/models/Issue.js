const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    // ✅ Updated category
    category: {
      type: String,
      enum: ["plumbing", "electrical", "hardware", "food", "other"],
      default: "other",
    },

    // ✅ New fields
    issueDate: {
      type: Date,
      required: true,
    },

    floor: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    roomNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 13,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Simplified status
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    studentVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ Soft delete
    isArchived: {
      type: Boolean,
      default: false,
    },
    
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

// ✅ Delete issues automatically if they are older than 3 days (3 * 24 * 60 * 60 = 259200 seconds)
issueSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });

module.exports = mongoose.model("Issue", issueSchema);
