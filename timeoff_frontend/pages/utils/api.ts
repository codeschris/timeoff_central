import axios from 'axios';
import Cookies from 'universal-cookie';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true,
});

const cookies = new Cookies();

// Fetch greeting
export const returnHello = async () => {
  const response = await API.get('/hello_chris/');
  return response.data;
};

// Fetch employees
export const returnEmployees = async () => {
  const response = await API.get('/employees/');
  return response.data;
};

// Fetch single employee
export const returnEmployee = async (employee_id: string) => {
  const response = await API.get(`/employee/${employee_id}/`);
  return response.data;
};

// Take leave: Test after implementing authentication
export const takeLeave = async (employee_id: string, start_date: string, end_date: string) => {
  const response = await API.post('/take-leave/', { employee_id, start_date, end_date });
  return response.data;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const response = await API.post('/login/', { email, password });
  const { token } = response.data;
  cookies.set('token', token, { path: '/' });
  return response.data;
};