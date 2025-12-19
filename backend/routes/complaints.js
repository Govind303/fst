
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { createComplaint, getComplaints, updateComplaintStatus, addFeedback, getMyComplaints } = require('../controllers/complaintController');

router.post('/', auth, role(['student']), createComplaint);
router.get('/my-complaints', auth, role(['student']), getMyComplaints);
router.get('/', auth, getComplaints);
router.put('/:id/status', auth, role(['assistant', 'plumber']), updateComplaintStatus);
router.post('/:id/feedback', auth, role(['student']), addFeedback);

module.exports = router;
