
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/assignments/my-tasks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setAssignments(res.data));
  }, []);

  const markCompleted = async (assignmentId) => {
    await axios.put(`http://localhost:5000/api/assignments/${assignmentId}/status`, {
      status: 'completed'
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setAssignments(assignments.filter(a => a._id !== assignmentId));
  };

  return (
    <ul>
      {assignments.map(a => (
        <li key={a._id}>
          Complaint: {a.complaint.description}
          {a.status !== 'completed' ? (
            <button onClick={() => markCompleted(a._id)}>Mark Completed</button>
          ) : (
            <div>
              <span>Completed</span>
              {a.feedback && <p>Feedback: {a.feedback}</p>}
              {a.rating && <p>Rating: {a.rating}</p>}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
