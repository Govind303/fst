const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { assignWorker, updateAssignmentStatus, getMyAssignments, submitFeedback } = require('../controllers/assignmentController');

router.post('/assign', auth, role(['assistant']), assignWorker);
router.get('/my-tasks', auth, role(['student', 'worker']), getMyAssignments);
router.put('/:id/status', auth, role(['worker']), updateAssignmentStatus);

router.put('/:id/feedback', auth, submitFeedback);

module.exports = router;
