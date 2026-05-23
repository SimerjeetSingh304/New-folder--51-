const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for fast queries by user
jobSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
