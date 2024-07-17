import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/selectors';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  const handleLogout = () => {
    if (isAuthenticated) {
      dispatch(logout());
    }
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" component="div">
              Skatextreame
            </Typography>
          </Box>
          {(location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/register') && (
            <NavButton color="inherit" onClick={handleLogout}>
              {isAuthenticated ? 'Logout' : 'Login'}
            </NavButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
