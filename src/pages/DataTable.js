import React, { useState } from 'react';
import '../css/AdminHome.css';

const DataTable = ({ data, onPageChange, totalPages, currentPage, renderActions }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleEditClick = (item) => {
    setEditingRow(item.id);
    setEditedData(item);
  };

  const handleInputChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const handleSaveClick = () => {
    if (renderActions) {
      renderActions.save(editedData);
    }
    setEditingRow(null);
  };

  const handleCancelClick = () => {
    setEditingRow(null);
  };

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            {(renderActions && data.length > 0) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, dataIndex) => (
            <tr key={dataIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {editingRow === item.id ? (
                    <input
                      type="text"
                      value={editedData[column]}
                      onChange={(e) => handleInputChange(e, column)}
                    />
                  ) : (
                    item[column]
                  )}
                </td>
              ))}
                {renderActions && (
                  <td>
                  {renderActions({item})}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
