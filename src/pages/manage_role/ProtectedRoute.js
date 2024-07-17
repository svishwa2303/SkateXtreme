import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUserRoles, selectIsAuthenticated } from '../../redux/selectors';

const ProtectedRoute = ({ path, children, roles }) => {
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectUserRoles);

  // console.log("Inside ProtectedROute---------");
  // console.log("path :: ",path);
  // console.log("roles :: ",roles);
  // console.log("userRoles :: ",userRoles);

  const hasAccess = useMemo(() => {
    //console.log("!isAuthenticated && path!==/login && path!==/register :: ",(!isAuthenticated && path!=="/login"));
    if (!isAuthenticated && path!=="/login" && path!=="/register") return false;
    return roles.some(role => userRoles.includes(role));
  }, [isAuthenticated, userRoles, roles]);

  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
