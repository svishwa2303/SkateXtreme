// rolesConfig.js
const rolesConfig = {
  '/': ['PUBLIC','ADMIN', 'IC', 'INSTRUCTOR'],
  '/login': ['PUBLIC','ADMIN', 'IC', 'INSTRUCTOR'],
  '/admin_home': ['ADMIN'],
  '/ic_home': ['ADMIN','IC'],
  '/profile': ['ADMIN', 'IC', 'INSTRUCTOR'],
  '/register': ['ADMIN', 'IC', 'INSTRUCTOR', 'PUBLIC'],
  // Add more routes and roles as needed
};

export default rolesConfig;
