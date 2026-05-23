const Problem = require('../models/Problem');

// GET /api/problems
const getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty, status, platform, search } = req.query;
    const query = { userId: req.user.userId };

    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (status && status !== 'All') query.status = status;
    if (platform && platform !== 'All') query.platform = platform;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: problems.length, data: problems });
  } catch (error) {
    next(error);
  }
};

// POST /api/problems
const createProblem = async (req, res, next) => {
  try {
    const { title, platform, difficulty, topic, status, timeToSolve, notes, link } = req.body;

    if (!title || !difficulty || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Title, difficulty, and topic are required.',
      });
    }

    const problem = await Problem.create({
      userId: req.user.userId,
      title,
      platform,
      difficulty,
      topic,
      status,
      timeToSolve,
      notes,
      link,
    });

    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

// GET /api/problems/:id
const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    if (problem.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

// PUT /api/problems/:id
const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    if (problem.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/problems/:id
const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    if (problem.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await problem.deleteOne();

    res.json({ success: true, message: 'Problem deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblems, createProblem, getProblem, updateProblem, deleteProblem };
