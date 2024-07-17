import React, { useState, useEffect, useRef } from 'react';
import { Grid, Typography, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchClient } from '../components/fetchClient';
import { useSelector } from 'react-redux';
import { selectUsername, selectToken } from '../redux/selectors';
import '../css/UserTable.css';

const MyAccount = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otpError, setOtpError] = useState('');
  const editDataRef = useRef(editData);
  const userToken = useSelector(selectToken);
  const isMobile = useMediaQuery('(max-width:600px)');
  const username = useSelector(selectUsername);

  useEffect(() => {
    fetchUsers();
  }, [username]);

  useEffect(() => {
    editDataRef.current = editData;
  }, [editData]);

  const fetchUsers = async () => {
    try {
      const response = await fetchClient(`http://localhost:8080/user/${username}`, {
        method: 'GET',
      }, null, userToken);
      const data = await response.json();
      setUsers([data]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditClick = (id, user) => {
    setEditId(id);
    setEditData(user);
  };

  const handleSaveClick = async () => {
    const dataToSave = editDataRef.current;
    try {
      const response = await fetchClient(`http://localhost:8080/users/${dataToSave.id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSave),
        headers: {
          'Content-Type': 'application/json',
        },
      }, null, userToken);

      if (!response.ok) {
        throw new Error('Error editing user');
      }

      fetchUsers();
      setEditId(null);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditData({});
  };

  const processRowUpdate = (newRow) => {
    setEditData((prev) => ({
      ...prev,
      ...newRow,
    }));
    return newRow;
  };

  const handleResetClick = async () => {
    setDialogOpen(true);
    const email = users[0]?.email;
    //console.log("email :: ",email);
    try {
      const response = await fetchClient('http://localhost:8080/notify/email-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      },null,userToken);

      if (response.ok) {
        setIsOtpSent(true);
        setOtpError('');
      } else {
        //console.log("Error sending OTP");
        throw new Error('Error sending OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    //console.log("handleVerifyOtp() :: ");
    const email = users[0]?.email;

    try {
      const response = await fetchClient('http://localhost:8080/notify/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      },null,userToken);
      //console.log("response :: ",response);
      if (response.status===200) {
        setIsOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError('Invalid OTP. Please try again or resend the OTP.');
        throw new Error('Error verifying OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleChangePassword = async () => {
    const email = users[0]?.email;

    try {
      const response = await fetchClient('http://localhost:8080/notify/change-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword }),
      },null,userToken);

      if (response.ok) {
        setDialogOpen(false);
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtp('');
        setNewPassword('');
      } else {
        throw new Error('Error changing password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleResendOtp = async () => {
    const email = users[0]?.email;

    try {
      const response = await fetchClient('http://localhost:8080/notify/email-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      },null,userToken);

      if (response.ok) {
        setIsOtpSent(true);
        setOtpError('');
      } else {
        throw new Error('Error resending OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: isMobile ? 70 : 100 },
    {
      field: 'username',
      headerName: 'Username',
      width: isMobile ? 100 : 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: isMobile ? 150 : 200,
      editable: true,
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      width: isMobile ? 100 : 150,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: isMobile ? 100 : 150,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 100 : 150,
      renderCell: (params) => (
        <>
          {editId === params.row.id ? (
            <>
              <IconButton color="primary" onClick={handleSaveClick}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancelClick}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <IconButton color="primary" onClick={() => handleEditClick(params.row.id, params.row)}>
              <EditIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  return (
    <Grid container spacing={2} className="app-container">
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" align="center">User Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <div className="user-table-container">
          <div className="user-table">
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              processRowUpdate={processRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
              autoHeight
            />
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleResetClick}>Reset Password</Button>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {!isOtpSent ? (
            <Typography>Sending OTP...</Typography>
          ) : !isOtpVerified ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="OTP"
                type="text"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {otpError && <Typography color="error">{otpError}</Typography>}
              <Button onClick={handleVerifyOtp} color="primary">Verify OTP</Button>
              <Button onClick={handleResendOtp} color="secondary">Resend OTP</Button>
            </>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button onClick={handleChangePassword} color="primary">Change Password</Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default MyAccount;
