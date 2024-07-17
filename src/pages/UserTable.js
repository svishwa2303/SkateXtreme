import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import '../css/UserTable.css';
import { fetchClient } from '../components/fetchClient';
import { selectToken } from '../redux/selectors';

const UserTable = ({ users, fetchUsers }) => {
  const [editIdx, setEditIdx] = useState(-1);
  const [editData, setEditData] = useState({});
  const isMobile = useMediaQuery('(max-width:600px)');
  const userToken = useSelector(selectToken);

  const handleEditClick = (idx, user) => {
    setEditIdx(idx);
    setEditData(user);
  };

  const deleteUser = async (userId) => {
    
      fetchClient(`http://localhost:8080/users/${userId}`, {
        method: 'DELETE',
      },null,userToken)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error deleting user');
          }
          return response.json(); 
        })
        .catch(error => console.error('Error deleting user:', error));
      fetchUsers();
    
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        fetchUsers();
        setEditIdx(-1);
      } else {
        console.error('Failed to edit user');
      }
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const columns = [
    { field: 'username', headerName: 'Username', width: isMobile ? 100 : 150, editable: editIdx !== -1 },
    { field: 'email', headerName: 'Email', width: isMobile ? 150 : 200, editable: editIdx !== -1 },
    { field: 'mobile', headerName: 'Mobile', width: isMobile ? 100 : 150, editable: editIdx !== -1 },
    { field: 'role', headerName: 'Role', width: isMobile ? 100 : 150, editable: editIdx !== -1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 100 : 150,
      renderCell: (params) => (
        <>
          {editIdx === params.rowIndex ? (
            <IconButton color="primary" onClick={handleSaveClick}>
              <SaveIcon />
            </IconButton>
          ) : (
            <>
              <IconButton
                color="primary"
                onClick={() => handleEditClick(params.rowIndex, params.row)}
              >
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

  const rows = users.map((user, idx) => ({ ...user, id: idx }));

  return (
    <div className="user-table-container">
      <div className="user-table">
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
      </div>
    </div>
  );
};

export default UserTable;
