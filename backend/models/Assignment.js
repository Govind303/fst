const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from plumber to worker
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    feedback: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    updated_at: { type: Date }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
