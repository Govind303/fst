import React, { useState } from 'react';
import API from '../../api';

const ComplaintForm = ({ onComplaintAdded }) => {
  const [form, setForm] = useState({ category: '', description: '' });
  const categories = ['plumbing', 'electrical', 'cleaning'];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/complaints', form);
      alert('Complaint submitted!');
      setForm({ category: '', description: '' });
      if (onComplaintAdded) {
        onComplaintAdded();
      }
    } catch (error) {
      alert('Submission failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
      <textarea name="description" placeholder="Describe the issue" value={form.description} onChange={handleChange} required />
      <button type="submit">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;
