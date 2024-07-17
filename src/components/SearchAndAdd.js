import React, { useState, useEffect } from 'react';
import '../css/AdminHome.css';
import { selectToken, selectUsername } from '../redux/selectors';
import { useSelector } from 'react-redux';
import { fetchClient } from './fetchClient';

const SearchAndAdd = ( { url, executeFunction, extraFields = [] } ) => {
    
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const userToken = useSelector(selectToken);
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  const [extraFieldValues, setExtraFieldValues] = useState({});

//   useEffect(() => {
//     onExtraFieldsChange(extraFieldValues);
//   }, [extraFieldValues, onExtraFieldsChange]);


  useEffect(() => {
    
    const fetchSuggestions = async () => {
      //console.log("suggestionSelected :: ",suggestionSelected);
      if (searchTerm.length > 0 && !suggestionSelected) {
        const suggestions = await searchUserByname();
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
    
    setSuggestionSelected(false); 
  }, [searchTerm]);


  const handleAdd = () => {
    //console.log("handleAdd");
  }

  const selectStudentFromList = (suggestion) => {
    setSelectedValue(suggestion);
    setSearchTerm(suggestion.studentsName);
    setSuggestions([]);
    setSuggestionSelected(true); 
    //console.log("suggestions :: ",suggestions);
  };

  const searchUserByname = async () => {
    //console.log("searchUserByname --------");
    //console.log(url+`${searchTerm}`);
    const response = await fetchClient(url,{},{query:searchTerm},userToken); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  
    // {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': 'Bearer ' + userToken,
    //     'Content-Type': 'application/json',
    //   },
    // });
    const data = await response.json();
    console.log("data :: ",data);
    //const names = data.map((item) => `${item.name} (${item.username})`);
    return data;
  };

  const handleClick = () => {
    
    setSuggestionSelected(false); 
    if(extraFields.length>0)
        {
            //onExtraFieldsChange(extraFieldValues);
            Object.assign(selectedValue, extraFieldValues);
        }
    executeFunction(selectedValue);
    
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-one') {
      setExtraFieldValues(prevFields => ({
        ...prevFields,
        [name]: value
      }));
    } else {
      setExtraFieldValues(prevFields => ({
        ...prevFields,
        [name]: value
      }));
    }
  };

  return (
    <div>
      <div className="search-add">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
        {extraFields.map(field => (
         <React.Fragment key={field.name}>
          {field.type === 'text' && (
            <input 
              type="text" 
              name={field.name} 
              placeholder={field.placeholder} 
              onChange={handleInputChange} 
            />
          )}
          {field.type === 'select' && (
            <select 
              name={field.name} 
              onChange={handleInputChange}
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>{option.text}</option>
              ))}
            </select>
          )}
        </React.Fragment>
      ))}
        <button onClick={handleClick} disabled={!selectedValue}>
          Add
        </button>
      </div>
      <ul className="suggestions">
        {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => selectStudentFromList(suggestion)}>
                {suggestion.studentsName} - {suggestion.location}/{suggestion.userId}
            </li>
            ))} 
      </ul>

    </div>
  );
};

export default SearchAndAdd;
