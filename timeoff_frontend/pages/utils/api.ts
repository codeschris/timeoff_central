import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Fetch greeting
export const returnHello = async () => {
  const response = await API.get('/hello_chris/');
  return response.data;
};

// Fetch employees
export const returnEmployees = async () => {
    const token = localStorage.getItem('token'); // Retrieve token
    const response = await API.get('/employees/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};