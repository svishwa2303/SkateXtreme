import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchClient } from '../components/fetchClient';
import { selectToken,selectUserRoles } from '../redux/selectors';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Accordion, AccordionSummary, AccordionDetails, Button,
  TextField, Typography, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const StudentDetailList = () => {
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [additionalData, setAdditionalData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fields, setFields] = useState([]);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const userToken = useSelector(selectToken);
  const userRoles = useSelector(selectUserRoles);
  const hasAdminRole = userRoles.includes('ADMIN');

  const transformData = (data) => {
    return data.map(({ studentsName, location, userId, remainingClasses }) => ({
      studentsName,
      location,
      userId,
      remainingClasses,
    }));
  };

  useEffect(() => {
    fetchClient(`http://localhost:8080/students?page=${currentPage}&size=10`, {
      method: 'GET',
    },null,userToken)
      .then(response => response.json())
      .then(data => {
        data.content = transformData(data.content);
        setData(data.content);
        setTotalPages(data.totalPages);

        if (data.content.length > 0) {
          setFields(Object.keys(data.content[0]));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [currentPage, userToken]);

  const handleRowClick = (location, userId) => {
    if (expandedRow === userId) {
      //setExpandedRow(null);
      setIsAccordionExpanded(false);
    } else {
      fetchClient(`http://localhost:8080/student`, {
        method: 'GET',
      }, { location: location, userId: userId }, userToken)
        .then(response => response.json())
        .then(data => {
          setAdditionalData(data);
          setExpandedRow(userId);
          setIsAccordionExpanded(true);
        })
        .catch(error => console.error('Error fetching additional data:', error));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsAccordionExpanded(true);
  };

  const handleSaveClick = (id) => {
    //console.log("JSON.stringify(additionalData) :: ",JSON.stringify(additionalData[0]));
    fetchClient(`http://localhost:8080/student`, {
        method: 'PUT',
        body: JSON.stringify(additionalData[0]), // Ensure additionalData contains the updated data
    },null,userToken)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
        return response.json();
    })
    .then(updatedData => {
        setData(data.map(item => item.userId === id ? updatedData : item));
        // Optionally, reset editing state
        setIsEditing(false);
        setIsAccordionExpanded(true);
    })
    .catch(error => console.error('Error saving data:', error));
};


  const handleDeleteClick = (id) => {
    fetchClient(`http://localhost:8080/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setData(data.filter(item => item.userId !== id));
        setExpandedRow(null);
        setIsAccordionExpanded(false);
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map(field => (
                <TableCell key={field}>{field}</TableCell>
              ))}
              {/* {(false ) && (<TableCell>Actions</TableCell>)} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <React.Fragment key={item.userId}>
                <TableRow onClick={() => handleRowClick(item.location, item.userId)}>
                  {fields.map(field => (
                    <TableCell key={field}>{item[field]}</TableCell>
                  ))}
                  <TableCell>
                    {expandedRow === item.userId && (
                      <>
                        {isEditing ? (
                          <>
                            <IconButton onClick={() => handleSaveClick(item.userId)}>
                              <SaveIcon />
                            </IconButton>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                          </>
                        ) : (
                          <IconButton onClick={handleEditClick}>
                            <EditIcon />
                          </IconButton>
                        )}
                        {hasAdminRole && (
                        <IconButton onClick={() => handleDeleteClick(item.userId)}>
                          <DeleteIcon />
                        </IconButton>)}
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === item.userId && (
                  <TableRow>
                    <TableCell colSpan={fields.length + 1}>
                      <Accordion expanded={isAccordionExpanded || isEditing} onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Additional Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {isEditing ? (
                            <div>
                              {additionalData.length > 0 ? (
                                <ul>
                                  {additionalData.map((item, index) => (
                                    <li key={index}>
                                      {Object.keys(item).map(key => (
                                        <div key={key}>
                                          <TextField
                                            label={key}
                                            value={item[key] || ''}
                                            onChange={(e) =>
                                              setAdditionalData(prevData => [
                                                ...prevData.slice(0, index),
                                                { ...prevData[index], [key]: e.target.value },
                                                ...prevData.slice(index + 1)
                                              ])
                                            }
                                            fullWidth
                                            margin="normal"
                                            disabled={key === 'userId'}
                                          />
                                        </div>
                                      ))}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No additional data available.</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              {additionalData.length > 0 ? (
                                <ul>
                                  {additionalData.map((item, index) => (
                                    <li key={index}>
                                      {Object.keys(item).map(key => (
                                        <div key={key}>
                                          <strong>{key}: </strong>
                                          {item[key]}
                                        </div>
                                      ))}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No additional data available.</p>
                              )}
                            </div>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span>Page {currentPage+1} of {totalPages}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages-1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudentDetailList;
