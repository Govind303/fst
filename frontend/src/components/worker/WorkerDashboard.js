import React from 'react';
import TaskList from './TaskList';
import { getUser } from '../../utils/auth';

const WorkerDashboard = () => {
  const user = getUser();
  const isAvailable = user && user.isAvailable !== undefined ? user.isAvailable : false; // Assuming default to false if not set

  return (
    <div>
      <h2>Your Tasks</h2>
      <TaskList />
    </div>
  );
};

export default WorkerDashboard;
