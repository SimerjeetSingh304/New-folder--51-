const mongoose = require('mongoose');
const Job = require('../models/Job');
const Problem = require('../models/Problem');

const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // ─── Job Stats ────────────────────────────────────────────────────────────
    const jobStatusAgg = await Job.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const jobStatusMap = {};
    jobStatusAgg.forEach((s) => (jobStatusMap[s._id] = s.count));

    const totalJobs = await Job.countDocuments({ userId });

    // Last 7 days applied count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyApplied = await Job.countDocuments({
      userId,
      appliedDate: { $gte: sevenDaysAgo },
    });

    const jobStats = {
      total: totalJobs,
      byStatus: {
        Applied: jobStatusMap['Applied'] || 0,
        OA: jobStatusMap['OA'] || 0,
        Interview: jobStatusMap['Interview'] || 0,
        Offer: jobStatusMap['Offer'] || 0,
        Rejected: jobStatusMap['Rejected'] || 0,
      },
      last7Days: recentlyApplied,
    };

    // ─── DSA Stats ────────────────────────────────────────────────────────────
    const [difficultyAgg, statusAgg, topicAgg] = await Promise.all([
      Problem.aggregate([
        { $match: { userId } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]),
      Problem.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Problem.aggregate([
        { $match: { userId } },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const diffMap = {};
    difficultyAgg.forEach((d) => (diffMap[d._id] = d.count));

    const statusMap = {};
    statusAgg.forEach((s) => (statusMap[s._id] = s.count));

    // Solved this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const solvedThisWeek = await Problem.countDocuments({
      userId,
      status: 'Solved',
      updatedAt: { $gte: weekStart },
    });

    const dsaStats = {
      total: diffMap['Easy'] + diffMap['Medium'] + diffMap['Hard'] || 0,
      byDifficulty: {
        Easy: diffMap['Easy'] || 0,
        Medium: diffMap['Medium'] || 0,
        Hard: diffMap['Hard'] || 0,
      },
      byStatus: {
        Solved: statusMap['Solved'] || 0,
        Attempted: statusMap['Attempted'] || 0,
        Todo: statusMap['Todo'] || 0,
      },
      topTopics: topicAgg.map((t) => ({ topic: t._id, count: t.count })),
      solvedThisWeek,
    };

    // ─── Streak Calculation (IST) ─────────────────────────────────────────────
    // Get all dates user was active (added job or problem), converted to IST date string
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;

    const toISTDateStr = (date) => {
      const ist = new Date(date.getTime() + IST_OFFSET);
      return ist.toISOString().split('T')[0];
    };

    const [jobDates, problemDates] = await Promise.all([
      Job.find({ userId }).select('createdAt').lean(),
      Problem.find({ userId }).select('createdAt').lean(),
    ]);

    const activeDatesSet = new Set([
      ...jobDates.map((j) => toISTDateStr(j.createdAt)),
      ...problemDates.map((p) => toISTDateStr(p.createdAt)),
    ]);

    const activeDates = [...activeDatesSet].sort().reverse(); // newest first

    let streak = 0;
    const todayIST = toISTDateStr(new Date());
    const yesterdayIST = toISTDateStr(new Date(Date.now() - 86400000));

    if (activeDatesSet.has(todayIST) || activeDatesSet.has(yesterdayIST)) {
      let checkDate = activeDatesSet.has(todayIST) ? todayIST : yesterdayIST;
      while (activeDatesSet.has(checkDate)) {
        streak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split('T')[0];
      }
    }

    // ─── Recent Items ─────────────────────────────────────────────────────────
    const [recentJobs, recentProblems] = await Promise.all([
      Job.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      Problem.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        jobStats,
        dsaStats,
        streak,
        recentJobs,
        recentProblems,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
