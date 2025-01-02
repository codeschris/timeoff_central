/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'universal-cookie';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Add token to headers for authenticated requests
API.interceptors.request.use((config) => {
  const token = cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

// Register user
interface RegisterUserData {
  name: string;
  email: string;
  employee_id: string;
  password: string;
  user_type: string;
  role: string;
}

export const registerUser = async (data: RegisterUserData) => {
  try {
      const response = await API.post('/register/', data);
      return response.data;
  } catch (error: any) {
      if (error.response) {
          throw new Error(error.response.data.message || "Registration failed.");
      } else {
          throw new Error("An error occurred. Please try again.");
      }
  }
};

// Fetch user by ID
export const fetchUserById = async (userId: string) => {
  const response = await API.get(`/user/${userId}/`);
  return response.data;
};
// Login user
export const loginUser = async (email: string, password: string) => {
  const response = await API.post('/token/', { email, password });
  const { access, refresh, user } = response.data;

  // Store tokens in cookies
  cookies.set('token', access, { path: '/' });
  cookies.set('refresh', refresh, { path: '/' });

  return { access, refresh, user };
};

// Fetch user profile
export const fetchUserProfile = async () => {
  const token = cookies.get('token');
  const response = await API.get('/user-profile/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  await API.post('/logout/', {}, { withCredentials: true });
  cookies.remove('token', { path: '/' });
  cookies.remove('refresh', { path: '/' });
  window.location.href = '/auth/login'; // Redirect user to login page once logged out
};

// Refresh token
export const refreshToken = async () => {
  const refresh = cookies.get('refresh');
  if (!refresh) throw new Error('No refresh token found');

  const response = await API.post('/token/refresh/', { refresh });
  const { access } = response.data;

  // Update access token
  cookies.set('token', access, { path: '/' });

  return access;
};

// Search User
export const searchUser = async (query: string) => {
  const response = await API.get(`/search-user/`, { params: { q: query } });
  return response.data;
};