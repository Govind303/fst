const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
        type: String, 
        enum: ['plumbing', 'electrical', 'cleaning'], // Add more as needed
        required: true 
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'assigned', 'in_progress', 'completed'], default: 'pending' },
    created_at: { type: Date, default: Date.now },
    resolved_at: { type: Date },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }
});

module.exports = mongoose.model('Complaint', complaintSchema);
