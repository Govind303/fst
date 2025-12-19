const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'assistant', 'worker'], // 'worker' is now generic
        required: true 
    },
    workerType: { 
        type: String, 
        enum: ['plumber', 'electrician', 'cleaner'], // Add more as needed
        required: function() { return this.role === 'worker'; }
    },
    isAvailable: { type: Boolean, default: true }, // For worker availability
    hostel: { type: String }, // For students/assistants
});

module.exports = mongoose.model('User', userSchema);