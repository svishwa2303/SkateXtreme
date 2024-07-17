// Profile.js
import React from 'react';
import { useSelector } from 'react-redux';
import {selectUserRoles, selectToken, selectIsAuthenticated, selectAuth } from '../redux/selectors';

const Profile = () => {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectUserRoles);
  
  //console.log("Inside Profile-------------");
  //console.log("isAuthenticated :: ",isAuthenticated);
  //console.log("userRoles :: ",userRoles);
  const user = useSelector((state) => state.auth.user);
  //console.log("user :: ");
  //console.log(user);

  return (
    <div>
      <h3>Roles:</h3>
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>
      {user && user.roles && (
        <div>
          <h3>Roles:</h3>
          <ul>
            {user.roles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
