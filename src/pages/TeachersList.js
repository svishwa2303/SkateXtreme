import React, { useState, useEffect, useRef } from 'react';
import UserForm from './UserForm';
import { Grid, Button, Typography, IconButton, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchClient } from '../components/fetchClient';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/selectors';
import '../css/TeachersList.css';
import '../css/UserTable.css'; // Import UserTable styles

const TeachersList = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const editDataRef = useRef(editData); // Ref to hold the latest editData
  const userToken = useSelector(selectToken);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    editDataRef.current = editData; // Update the ref whenever editData changes
  }, [editData]);

  const fetchUsers = async (page) => {
    try {
      const response = await fetchClient(`http://localhost:8080/users?page=${page - 1}&size=10`, {
        method: 'GET',
      }, null, userToken);
      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleEditClick = (id, user) => {
    setEditId(id);
    setEditData(user);
  };

  const handleProcessRowUpdate = (newRow) => {
    if (editId === newRow.id) {
      setEditData(newRow);
    }
    return newRow;
  };

  const deleteUser = async (userId) => {
    await fetchClient(`http://localhost:8080/users/${userId}`, {
      method: 'DELETE',
    }, null, userToken)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting user');
        }
        return response;
      })
      .catch(error => console.error('Error deleting user:', error));
    fetchUsers(currentPage);
  };

  const handleSaveClick = async () => {
    const dataToSave = editDataRef.current; // Use the latest editData from the ref
    //console.log("editData :: ", dataToSave);
    await fetchClient(`http://localhost:8080/users/${dataToSave.id}`, {
      method: 'PUT',
      body: JSON.stringify(dataToSave),
      headers: {
        'Content-Type': 'application/json',
      },
    }, null, userToken)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error editing user');
        }
        return response;
      })
      .catch(error => console.error('Error editing user:', error));
    fetchUsers(currentPage);
    setEditId(null);
  };

  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      width: isMobile ? 100 : 150,
      editable: editId !== null,
      cellClassName: (params) => (editId === params.row.id ? 'editable-cell' : ''),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: isMobile ? 150 : 200,
      editable: editId !== null,
      cellClassName: (params) => (editId === params.row.id ? 'editable-cell' : ''),
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      width: isMobile ? 100 : 150,
      editable: editId !== null,
      cellClassName: (params) => (editId === params.row.id ? 'editable-cell' : ''),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: isMobile ? 100 : 150,
      editable: editId !== null,
      cellClassName: (params) => (editId === params.row.id ? 'editable-cell' : ''),
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
              <IconButton onClick={() => setEditId(null)}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton color="primary" onClick={() => handleEditClick(params.row.id, params.row)}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => deleteUser(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </>
      ),
    },
  ];

  const rows = users.map((user) => ({ ...user, id: user.id }));

  return (
    <Grid container spacing={2} className="app-container">
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" align="center">User Management</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} align="center">
        <Button variant="contained" color="primary" onClick={toggleForm}>
          {showForm ? 'Hide Form' : 'Add User'}
        </Button>
      </Grid>
      <Grid item xs={12}>
        {showForm && <UserForm fetchUsers={() => fetchUsers(currentPage)} />}
      </Grid>
      <Grid item xs={12}>
        <div className="user-table-container">
          <div className="user-table">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              processRowUpdate={handleProcessRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className="pagination" align="center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
};

export default TeachersList;
