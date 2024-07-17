import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/StudentAttendance.css';
import { selectToken, selectUsername } from '../redux/selectors';
import { useSelector } from 'react-redux';
import SearchAndAdd from '../components/SearchAndAdd';
import { fetchClient } from '../components/fetchClient';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const StudentAttendance = () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const user = useSelector(selectUsername);
  const today = new Date();
  const formattedToday = formatDate(today);

  const [activeTab, setActiveTab] = useState('10:30');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const userToken = useSelector(selectToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [studentsHistory, setStudentsHistory] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});

  const searchAndAddUrl = 'http://localhost:8080/searchStudents';

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 0) {
        const suggestions = await searchUserByname();
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const searchUserByname = async () => {
    const response = await fetchClient(`http://localhost:8080/searchStudents?query=${searchTerm}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedValue(null);
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleAdd = (value) => {
    if (value && selectedDate) {
      const data = {
        userId: value.userId,
        studentsName: value.studentsName,
        parentsName: value.parentsName,
        dateAttended: selectedDate,
        batch: activeTab,
        ic: user,
      };
      fetch('http://localhost:8080/addStudentHistory', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + userToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(data => {
          fetchStudentsHistory(currentPage);
          setSelectedValue(null);
          setSearchTerm('');
          setSuggestions([]);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  useEffect(() => {
    fetchStudentsHistory(currentPage);
  }, [currentPage, selectedDate, activeTab]);

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: `${item.id}`, // Ensure the ID is unique
      studentsName: item.studentsName,
      userId: item.userId,
      remainingClasses: item.remainingClasses,
      ic: item.ic,
    }));
  };

  const fetchStudentsHistory = async (page) => {
    try {
      //console.log(`http://localhost:8080/searchStudentsHistory?batch=${activeTab}&dateAttended=${selectedDate}&page=${page - 1}&size=20`);
      const response = await fetch(
        `http://localhost:8080/searchStudentsHistory?batch=${activeTab}&dateAttended=${selectedDate}&page=${page - 1}&size=20`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      //console.log("data.content :: ",(data.content));
      setStudentsHistory(transformData(data.content));
      //console.log("transformData :: ",(transformData(data.content)));
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/deleteStudHistory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + userToken,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchStudentsHistory(currentPage);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handlePageChange = (params) => {
    setCurrentPage(params.page + 1);
  };

  const columns = [
    { field: 'studentsName', headerName: 'Student Name', flex: 1 },
    { field: 'userId', headerName: 'User Id', flex: 1 },
    { field: 'remainingClasses', headerName: 'Remaining Classes', flex: 1 },
    { field: 'ic', headerName: 'IC', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="date-picker">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <br />
        <br />
      </div>
      <div className="tabs">
        {['10:30', '2:00', '3:30', '5:00'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => handleTabChange(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <SearchAndAdd url={searchAndAddUrl} executeFunction={handleAdd} />
      <div className="table">
        <DataGrid
          rows={studentsHistory}
          columns={columns}
          pageSize={20}
          pagination
          onPageChange={handlePageChange}
          rowCount={totalPages * 20}
          paginationMode="server"
          autoHeight
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default StudentAttendance;
