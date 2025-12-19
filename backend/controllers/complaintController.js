const Complaint = require('../models/Complaint');
const User = require('../../backend/models/User');
const Assignment = require('../models/Assignment');

exports.createComplaint = async (req, res) => {
    try {
        const complaint = new Complaint({
            student: req.user._id, // Correctly set the student field
            category: req.body.category,
            description: req.body.description,
            status: 'pending',
        });
        console.log("Creating complaint:", complaint); // Log complaint object
        console.log("req.body:", req.body); // Log request body
        console.log("req.user:", req.user); // Log user object
        await complaint.save();
        console.log("Complaint saved successfully");

        // Create a new assignment for the complaint
        // TODO: Implement logic to assign the complaint to a worker or assistant.
        // Find a worker (replace wcd backend
        // ith your actual worker selection logic)
        console.log("User model:", User);
        const worker = await User.findOne({ role: 'worker' }); // Find a worker
        if (!worker) {
            return res.status(500).json({ message: 'No worker found' }); // Handle the case where no worker is available
        }

        const assignment = new Assignment({
            complaint: complaint._id,
            assigned_by: req.user._id, // The student is assigning the complaint
            worker: worker._id, // Assign the found worker
            status: 'pending',
        });
        console.log("Creating assignment:", assignment); // Log assignment object
        await assignment.save();
        console.log("Assignment saved successfully");

        res.json(complaint);
    } catch (err) {
        console.error("Error creating complaint:", err);
        console.error("req.body:", req.body);
        console.error("Error message:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ student: req.user._id });

        // For each complaint, find the associated assignment
        const complaintsWithAssignments = await Promise.all(complaints.map(async (complaint) => {
            const assignment = await Assignment.findOne({ complaint: complaint._id });
            return {
                ...complaint.toJSON(), // Convert Mongoose document to plain object
                assignment: assignment ? assignment.toJSON() : null // Include assignment data or null
            };
        }));

        console.log("Complaints with assignments sent to frontend:", complaintsWithAssignments); // Log the data being sent
        res.json(complaintsWithAssignments);
    } catch (err) {
        console.error("Error fetching complaints with assignments:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'student') filter.student = req.user._id;
        const complaints = await Complaint.find(filter).populate('student', 'name email');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        complaint.status = req.body.status;
        if (req.body.status === 'completed') {
            complaint.resolved_at = new Date();
        }
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addFeedback = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        complaint.feedback = {
            rating: req.body.rating,
            comment: req.body.comment
        };
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
