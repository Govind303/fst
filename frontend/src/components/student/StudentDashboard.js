import React, { useEffect, useState } from 'react';
import API from '../../api';
import ComplaintForm from './ComplaintForm';
import { getUser } from '../../utils/auth';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedAssignmentId, setSelectedAssignmentId ]= useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false); // State for feedback dialog
  const user = getUser();
  const userHostel = user && user.hostel ? user.hostel : 'N/A';

  const fetchAssignments = async () => {
    try {
      const res = await API.get('/assignments/my-tasks');
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/complaints/my-complaints');
      console.log("Complaints fetched:", res.data);
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchComplaints();
  }, []);

  const handleFeedbackSubmit = async (assignmentId) => {
    try {
      await API.put(`/assignments/${assignmentId}/feedback`, { feedback, rating });
      fetchComplaints(); // Refresh complaints to show updated feedback status
      setFeedback('');
      setRating(0);
      setSelectedAssignmentId(null);
      setShowFeedbackDialog(false); // Close the dialog
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  return (
    <div>
      <h2>Submit a Complaint</h2>
      <ComplaintForm onComplaintAdded={fetchComplaints} />
      <h2>Your Assignments</h2>
      <p>Your Hostel: {userHostel}</p>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment._id}>
            <h4>Complaint: {assignment.complaint.subject}</h4>
            <p>Worker: {assignment.worker ? assignment.worker.name : 'N/A'}</p>
            <p>Status: {assignment.status}</p>
            {assignment.status === 'completed' && (assignment.feedback ? (
              <div>
                <p>Your Feedback: {assignment.feedback}</p>
                <p>Your Rating: {assignment.rating}</p>
              </div>
            ) : (
              <div>
                <p>Provide Feedback:</p>
                <textarea
                  value={selectedAssignmentId === assignment._id ? feedback : ''}
                  onChange={(e) => {
                    setSelectedAssignmentId(assignment._id);
                    setFeedback(e.target.value);
                  }}
                ></textarea>
                <div>
                  <label htmlFor={`rating-${assignment._id}`}>Rating:</label>
                  <input
                    type="number"
                    id={`rating-${assignment._id}`}
                    min="1"
                    max="5"
                    value={selectedAssignmentId === assignment._id ? rating : 0}
                    onChange={(e) => {
                      setSelectedAssignmentId(assignment._id);
                      handleRatingChange(e);
                    }}
                  />
                </div>
                <button onClick={() => handleFeedbackSubmit(assignment._id)}>Submit Feedback</button>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <h2>Your Complaints</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Category</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Status</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Created At</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Assigned At</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Resolved At</th>
            <th style={{ border: '1px solid black', padding: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {complaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((complaint, index) => (
            <tr key={complaint._id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{complaint.category}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{complaint.description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{complaint.status}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(complaint.created_at).toLocaleString()}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {complaint.assignment && complaint.assignment.assigned_at ? new Date(complaint.assignment.assigned_at).toLocaleString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {complaint.status === 'completed' && complaint.resolved_at ? new Date(complaint.resolved_at).toLocaleString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {complaint.status === 'completed' && complaint.assignment && !complaint.assignment.feedback && (
                  <button onClick={() => {
                    setSelectedAssignmentId(complaint.assignment._id);
                    setShowFeedbackDialog(true);
                  }}>Provide Feedback</button>
                )}
                {complaint.status === 'completed' && complaint.assignment && complaint.assignment.feedback && (
                  <div>
                    <p>Feedback: {complaint.assignment.feedback}</p>
                    <p>Rating: {complaint.assignment.rating}</p>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Feedback Dialog */}
      {showFeedbackDialog && (
        <div className="feedback-dialog" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid black',
          zIndex: 1000 // Ensure it's on top
        }}>
          <h3>Provide Feedback</h3>
          <textarea
            placeholder="Enter your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <div>
            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={handleRatingChange}
            />
          </div>
          <button onClick={() => handleFeedbackSubmit(selectedAssignmentId)}>Submit</button>
          <button onClick={() => setShowFeedbackDialog(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
