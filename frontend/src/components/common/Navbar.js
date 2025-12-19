import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && user.role === 'student' && <Link to="/student">Student Dashboard</Link>}
      {user && user.role === 'assistant' && <Link to="/assistant">Assistant Dashboard</Link>}
      {user && user.role === 'worker' && <Link to="/worker">Worker Dashboard</Link>}
      {user && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;