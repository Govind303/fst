const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const assignmentRoutes = require('./routes/assignments');
const workerRoutes = require('./routes/workers'); // <-- Add this line

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.get('/test-env', (req, res) => {
    res.json({
        port: process.env.PORT,
        mongoUri: process.env.MONGO_URI,
        jwtSecret: process.env.JWT_SECRET
    });
});
app.get('/', (req, res) => {
    res.send('Hostel Complaint Management API');
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/workers', workerRoutes); // <-- Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

