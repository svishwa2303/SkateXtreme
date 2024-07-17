import React from 'react';



const dynamicImport = (path) => {
  switch (path) {
    case '/':
      return React.lazy(() => import('../Login'));
      case '/login':
        return React.lazy(() => import('../Login'));
    case '/admin_home':
      return React.lazy(() => import('../AdminHome'));
    case '/ic_home':
      return React.lazy(() => import('../ICHome'));
    case '/profile':
      return React.lazy(() => import('../Profile'));
    case '/register':
      return React.lazy(() => import('../RegistrationForm'));
    // Add more paths as needed
    default:
      return React.lazy(() => import('../NoPage'));
  }
};

export default dynamicImport;
