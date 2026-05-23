const express = require('express');
const router = express.Router();
const {
  getProblems,
  createProblem,
  getProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problem.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.route('/').get(getProblems).post(createProblem);
router.route('/:id').get(getProblem).put(updateProblem).delete(deleteProblem);

module.exports = router;
