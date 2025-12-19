const Assignment = require('../models/Assignment');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const assignWorker = async (req, res) => {
    try {
        console.log("assignWorker req.body:", req.body);
        const { complaintId, workerId } = req.body;
        console.log("complaintId:", complaintId);
        console.log("workerId:", workerId);
        const worker = await User.findById(workerId);
        console.log("worker:", worker);
        const complaint = await Complaint.findById(complaintId);
        console.log("complaint:", complaint);

        let mappedWorkerType;
        if (complaint.category === "plumbing") {
          mappedWorkerType = "plumber";
        } else if (complaint.category === "electrical") {
          mappedWorkerType = "electrician";
        } else if (complaint.category === "cleaning") {
          mappedWorkerType = "cleaner";
        } else {
          mappedWorkerType = ""; // Or handle the default case as needed
        }

        // Constraint: Worker type must match complaint category
        if (worker.workerType !== mappedWorkerType) {
            return res.status(400).json({ message: 'Worker type does not match complaint category' });
        }

        // Constraint: Worker must be available
        // if (!worker.isAvailable) {
        //     return res.status(400).json({ message: 'Worker is not available' });
        // }

        // Assign worker
        const assignment = new Assignment({
            complaint: complaintId,
            worker: workerId,
            assigned_by: req.user._id
        });
        await assignment.save();

        // Update complaint status
        complaint.status = 'assigned';
        await complaint.save();

        // Set worker as unavailable
        worker.isAvailable = false;
        console.log("worker.isAvailable set to false");
        await worker.save();
        console.log("worker.save() called");

        complaint.status = 'assigned';
        console.log("complaint.status set to assigned");
        await complaint.save();
        console.log("complaint.save() called");

        console.log("Assignment saved, about to respond");
        try {
            res.json(assignment);
        } catch (jsonError) {
            console.error("Error sending JSON:", jsonError);
            res.status(500).json({ message: "Error sending response" });
        }
    } catch (err) {
        console.error("Error in assignWorker:", err);
        res.status(500).json({ message: err.message });
    }
};

const submitFeedback = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        const { feedback, rating } = req.body;

        assignment.feedback = feedback;
        assignment.rating = rating;
        assignment.updated_at = Date.now();

        await assignment.save();
        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getMyAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ worker: req.user._id }).populate('complaint');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateAssignmentStatus = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.status = req.body.status;
	console.log("Updating assignment status to:", req.body.status);
        assignment.updated_at = new Date();
        await assignment.save();
	console.log("Assignment saved with new status");

        const worker = await User.findById(assignment.worker);
        // Optionally update complaint status
        if (req.body.status === 'completed') {
            await Complaint.findByIdAndUpdate(assignment.complaint, { status: 'completed', resolved_at: new Date() });
            // Set worker as available again
            if (worker) {
              worker.isAvailable = true;
              await worker.save();
            }
        } else {
            await Complaint.findByIdAndUpdate(assignment.complaint, { status: req.body.status });
        }

        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    assignWorker,
    getMyAssignments,
    updateAssignmentStatus,
    submitFeedback,
};
