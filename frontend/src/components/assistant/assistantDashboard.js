import React, { useEffect, useState } from 'react';
import API from '../../api';
import AssignWorker from './AssignWorker';

const AssistantDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await API.get('/complaints');
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div>
      <h2>Complaints</h2>
      <ul>
        {complaints.filter(c => c.status === 'pending').map(c => (
          <li key={c._id}>
            {c.category} - {c.description}
            <AssignWorker complaint={c} onAssigned={fetchComplaints} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssistantDashboard;