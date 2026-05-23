const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    platform: {
      type: String,
      enum: ['IndiaBix', 'GeeksforGeeks', 'HackerRank', 'InterviewBit', 'Other'],
      default: 'IndiaBix',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    status: {
      type: String,
      enum: ['Solved', 'Attempted', 'Todo'],
      default: 'Todo',
    },
    timeToSolve: {
      type: Number, // in minutes
    },
    notes: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for fast queries by user
problemSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Problem', problemSchema);
