const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { name, email, password, role, hostel, workerType } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // For worker, workerType is required
        if (role === 'worker' && !workerType) {
            return res.status(400).json({ message: 'Worker type is required' });
        }

        // For student/assistant, hostel is required
        if ((role === 'student' || role === 'assistant') && !hostel) {
            return res.status(400).json({ message: 'Hostel is required' });
        }

        user = new User({ name, email, password, role, hostel, workerType });
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Registration error:', err); // Add this for debugging
        res.status(500).json({ message: err.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
