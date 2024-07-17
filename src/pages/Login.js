import React, { useState, useEffect } from 'react';
import '../css/Login.css'; // Your CSS file for styling
import { useDispatch } from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import { login, logout } from '../redux/authSlice';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

         
  useEffect(() => {
    dispatch(logout());
  }, []);
  

    const handleLogin =  async (event) => {
      event.preventDefault(); 
        // Simulated login process
       
        try {
            const response = await fetch(`http://localhost:8080/authenticate`, {
              method: 'POST', // Assuming your API uses PUT for editing
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'username':username, 'password':password}),
            });
            if (response.ok) {
                //console.log("response :: ",response);
                const data = await response.json();
                //console.log("data :: ",data);
                //console.log(data.username,data.token);
                const username = data.username;
                const token = data.token;
                const roles = data.role;
                // console.log("usernameRes :: ",username);
                // console.log("token :: ",token);
                // console.log("roles :: ",roles);
                dispatch(login({username, token, roles}));
                // console.log("before redirecting to profile");
                // console.log("roles.includes('ADMIN') :: ",roles.includes('ADMIN'));
                if(roles.includes('ADMIN')){
                  navigate('/admin_home');
                }
                else if(roles.includes('IC')){
                  navigate('/ic_home');
                }
                else{
                  navigate('/profile');
                }
               // Refresh user list after edit
               // Exit edit mode
            } else {
              console.error('Failed to Login user');
            }
          } catch (error) {
            console.error('Error editing user:', error);
          }
        // You can add your login logic here, such as API calls for authentication
    
      };



 

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;
