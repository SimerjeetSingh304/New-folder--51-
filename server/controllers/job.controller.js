const Job = require('../models/Job');

// GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;
    const query = { userId: req.user.userId };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { appliedDate: -1 }; // default: newest first
    if (sort === 'appliedDate_asc') sortOption = { appliedDate: 1 };
    if (sort === 'company_asc') sortOption = { company: 1 };

    const jobs = await Job.find(query).sort(sortOption);

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    const { company, role, status, appliedDate, notes, link, salary, location } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required.' });
    }

    const job = await Job.create({
      userId: req.user.userId,
      company,
      role,
      status,
      appliedDate,
      notes,
      link,
      salary,
      location,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, createJob, getJob, updateJob, deleteJob };
