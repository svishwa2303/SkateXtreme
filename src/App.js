import React, { Suspense, lazy, startTransition } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './pages/Navbar';
import rolesConfig from './pages/manage_role/rolesConfig';
import ProtectedRoute from './pages/manage_role/ProtectedRoute';
import dynamicImport from './pages/manage_role/dynamicImport';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { useLocation } from 'react-router-dom';

const NoPage = lazy(() => import('./pages/NoPage'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <>
      <ConditionalNavbar  />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route index element={<Login />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {Object.keys(rolesConfig).map((path) => {
            const Component = dynamicImport(path);
            return (
              <Route 
                key={path}
                path={path}
                element={
                  <ProtectedRoute path={path} roles={rolesConfig[path]}>
                    <Component />
                  </ProtectedRoute>
                }
              />
            );
          })}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();

  return location.pathname !== '/login' && <Navbar />;
};



export default App;
