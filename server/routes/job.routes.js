const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJob, updateJob, deleteJob } = require('../controllers/job.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;
