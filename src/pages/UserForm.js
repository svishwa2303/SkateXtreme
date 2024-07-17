import React, { useState } from 'react';
import '../css/UserForm.css';

const UserForm = ({ fetchUsers }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/register/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, mobile, role, password }),
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
        fetchUsers();
        setUsername('');
        setEmail('');
        setMobile('');
        setRole('');
        setPassword('');
      } else {
        console.error('Failed to add user');
        setMessage('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Failed to add user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Mobile:
        <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
      </label>
      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="ADMIN,INSTRUCTOR,IC">Admin</option>
          <option value="INSTRUCTOR,IC">IC</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>
      </label>
      <label>
        Temporary Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {message && <p>{message}</p>}
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;
