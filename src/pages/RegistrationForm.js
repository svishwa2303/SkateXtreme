import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/RegistrationForm.css';
import { validateEmail } from '../utils/utils';

const RegistrationForm = () => {

  useEffect(() => {
    if(formData.mobile==='+65 ' || formData.mobile.length==12){
      setInvalidMobile(false);
    }
  }, []);


  const [formData, setFormData] = useState({
    studentsName: '',
    parentsName: '',
    location:'01',
    email: '',
    mobile: '+65 '
  });

  const options = [
    { value: '01', label: 'Rhu Cross' },
    { value: '02', label: 'Ponggol' },
    { value: '03', label: 'Choa chu kang' },
    { value: '04', label: 'Bedok' }
  ];

  const [validEmail, setValidEmail] = useState(false);
  const [invalidMobile, setInvalidMobile] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  
  const isFormValid = (validEmail || formData.email==='') && !invalidMobile && formData.studentsName.trim() !== '';


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

      if (name === 'email') {
        setValidEmail(validateEmail(value));
        if(name===''){
            setValidEmail(true);
        }
      }
      else if(name === 'mobile'){
        if(value.startsWith('+65 ')){
            const isInvalidMobile = (value.length === 12? false:true);
            setInvalidMobile(isInvalidMobile);
        }else{
            setFormData({ ...formData, [name]: '+65 ' });
        }
      }
      else if(name==='location'){
        setSelectedOption(e.target.value);
      }
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/register/student', formData)
      .then(response => {
        if (response.status === 200) {
            setMessage('Registration Successful with User Id '+response.data.location +'/'+response.data.userId);
            //console.log('Registration successful!', response.data);
            setFormData({
                studentsName: '',
                parentsName: '',
                location:'01',
                email: '',
                mobile: '+65 '
              });
              setInvalidMobile(false);
          } else {
            setMessage('Registration Failed');
          }
      })
      .catch(error => {
        console.error('There was an error with the registration!', error);
      });
  };

//   const handleClick = () => {
//     // Increment the click count
    
//     console.log("!usernameExists :: "+!usernameExists);
//     console.log("validEmail :: "+validEmail);
//     console.log("formData.username.trim() :: ",formData.username.trim() !== '');
//     console.log("!invalidMobile :: "+!invalidMobile);
//     console.log("formData.name.trim() :: ",formData.name.trim() !== '');
//     console.log("--------------------");
//   };

  return (
    <div className="App"> 
    
        <form onSubmit={handleSubmit}>
        <h1><center>Skatextreme Registration Form</center></h1>
            <fieldset> 
                <h2>Sign Up</h2>
                <div className="Field">
                    <label>Student's name <sup>*</sup></label>
                    <input
                    type="text"
                    name="studentsName"
                    value={formData.studentsName}
                    onChange={handleChange}
                    />
                </div>
                <div className="Field">
                  <label>Location</label>
                  <select name="location" value={selectedOption} onChange={handleChange} disabled={true}>
                  <option value="" disabled>Select an option</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Field">
                    <label>Parent/Guardian's Name </label>
                    <input
                    type="text"
                    name="parentsName"
                    value={formData.parentsName}
                    onChange={handleChange}
                    />
                </div>
                <div className="Field">
                    <label>Email </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    />
                    {validEmail && <p>Please enter a valid email!</p>}
                </div>
                <div className="Field">
                    <label>Whatsapp no  <sup>*</sup></label>
                    <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    />
                    {(invalidMobile && formData.mobile!=='+65 ')&& <p>Please enter a valid mobile number!</p>}
                </div>
                {message && <p>{message}</p>}
                <button disabled={!isFormValid} type="submit">Submit</button>
                {/* <button onClick={handleClick} type="button">check</button> */}
            </fieldset> 
        </form>
    </div>
  );
};

export default RegistrationForm;
