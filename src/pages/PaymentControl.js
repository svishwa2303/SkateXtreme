import React, { useState, useEffect } from 'react';
import '../css/AdminHome.css';
import SearchAndAdd from '../components/SearchAndAdd';
import { useSelector } from 'react-redux';
import { selectToken, selectUsername } from '../redux/selectors';
import DataTable from './DataTable';

const PaymentControl = () => {

    const user = useSelector(selectUsername);
    const userToken = useSelector(selectToken);
    const [addPayment, setAddPayment] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPaymentHistory(1);
    }, []);

    const transformData = (data) => {
        return data.map(({  username, packageType, ic, location }) => ({
          username,
          packageType,
          ic,
          location,
        }));
      };
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };

    const fetchPaymentHistory = async (page) => {
        //console.log("fetchPaymentHistory----------------");
        try {
            const response = await fetch(
              `http://localhost:8080/getPaymentHistory?page=${page - 1}&size=20`,
              {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + userToken,
                  'Content-Type': 'application/json',
                },
              }
            );
            const data = await response.json();
            //console.log(data);
            setPaymentHistory(transformData(data.content));
            setTotalPages(data.totalPages);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
    }
    const addFunction = (value) => {
        const { father_name, fromDate, id, name, remainingClasses, toDate, mobile, ...modifiedObject } = value;

        const value1 = {
            ...modifiedObject,
            'ic': user
          };
          
        //console.log("addFunction2 :: ",value1);
        fetch('http://localhost:8080/addPaymentHistory', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(value1),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.text(); // Assuming response is JSON
            })
            .then(data => {
                
              // Handle success response
              //console.log('Success:', data);
              fetchPaymentHistory(1);
              
            })
            .catch(error => {
              // Handle error
              console.error('Error:', error);
            });
    }

    const handleExtraFieldsChange = (fields) => {
        //console.log('Extra Fields:', fields);
      };

      const renderActions = ({  }) => (
        <div>
         
        </div>
      );

    const searchAndAddUrl = 'http://localhost:8080/searchStudents?query=';

  return (
    <>
        <div>
        <SearchAndAdd url = {searchAndAddUrl}
            executeFunction = {addFunction}
            extraFields={[
                { type: 'select', name: 'packageType', options: [
                { value: '', text: 'Select an option' },
                { value: '4 weeks', text: '4 weeks ($120)' },
                { value: '8 weeks', text: '8 weeks ($200)' }
                ]},
                { type: 'select', name: 'location', options: [
                    { value: '', text: 'Select an option' },
                    { value: 'Rhu Cross', text: 'Rhu Cross' }
                ]}
            ]}
            />

        </div>
        <div>
            <p>Payment History</p>
            <div className="table">
                <DataTable
                data={paymentHistory}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                currentPage={currentPage}
                renderActions={null}
                />
      </div>
        </div>
    </>
  );
};

export default PaymentControl;
