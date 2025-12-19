
import React, { useEffect, useState } from 'react';
import API from '../../api';

const AssignWorker = ({ complaint, onAssigned }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    console.log("Complaint Category:", complaint.category);
    let workerType;
    if (complaint.category === "plumbing") {
      workerType = "plumber";
    } else if (complaint.category === "electrical") {
      workerType = "electrician";
    } else if (complaint.category === "cleaning") {
      workerType = "cleaner";
    } else {
      workerType = ""; // Or handle the default case as needed
    }
    API.get('/workers', { params: { workerType: workerType } })
      .then(res => setWorkers(res.data));
  }, [complaint.category]);

  const handleAssign = async () => {
    await API.post('/assignments/assign', {
      complaintId: complaint._id,
      workerId: selectedWorker
    });
    alert('Worker assigned!');
    if (onAssigned) onAssigned();
  };

  return (
    <div>
      <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)}>
        <option value="">Select Worker</option>
        {workers.map(w => (
          <option key={w._id} value={w._id}>{w.name} ({w.workerType})</option>
        ))}
      </select>
      <button onClick={handleAssign} disabled={!selectedWorker}>Assign</button>
    </div>
  );
};

export default AssignWorker;
