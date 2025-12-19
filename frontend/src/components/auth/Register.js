import React, { useState } from 'react';
import API from '../../api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    workerType: '',
    hostel: ''
  });

  const workerTypes = ['plumber', 'electrician', 'cleaner'];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (err) {
      alert('Registration failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange} value={form.role}>
        <option value="student">Student</option>
        <option value="assistant">Assistant</option>
        <option value="worker">Worker</option>
      </select>
      {form.role === 'worker' && (
        <select name="workerType" onChange={handleChange} required>
          <option value="">Select Worker Type</option>
          {workerTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      )}
      {(form.role === 'student' || form.role === 'assistant') && (
        <input name="hostel" placeholder="Hostel" onChange={handleChange} required />
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;