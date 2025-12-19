import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './components/common/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import AssistantDashboard from './components/assistant/assistantDashboard';
import WorkerDashboard from './components/worker/WorkerDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/assistant" element={<AssistantDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;