/* eslint-disable @typescript-eslint/no-explicit-any */

/** API is using Django v5
 * 
 * Endpoints:
 * 1. Fetch greeting
 * 2. Fetch employees
 * 3. Fetch single employee
 * 4. Take leave
 * 5. Register user
 * 6. Login user
 * 7. Fetch user profile
 * 8. Logout user
 * 9. Refresh token
 * 10. Search user 
*/

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
export const takeLeave = async (start_date: string, end_date: string, purpose: string = "Annual") => {
  const token = cookies.get("token");
  if (!token) throw new Error("User not authenticated");

  const response = await API.post(
    "/leave/request/",
    { start_date, end_date, purpose },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getLeaveHistory = async (employee_id: string) => {
  const token = cookies.get("token");
  if (!token) throw new Error("User not authenticated");

  const response = await API.get(`/leave/request/${employee_id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

// Login user
export const loginUser = async (email: string, password: string) => {
  const response = await API.post('/token/', { email, password });
  const { access, refresh, user } = response.data;

  // Store tokens in cookies
  cookies.set('token', access, { path: '/' });
  cookies.set('refresh', refresh, { path: '/' });

  return { access, refresh, user };
};

// Handle Login sessions
/** null at the moment */

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
  window.location.href = '/auth/login';
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

// Recent Activities
export async function getRecentActivities() {
  const response = await API.get("/recent-activities/");
  if (response.status !== 200) {
    throw new Error("Failed to fetch recent activities.");
  }
  return response.data;
}

// Retrieve Leave logs
export async function fetchEmployeeLeaveLogs(employee_id: string) {
  const response = await API.get(`/leaves/${employee_id}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch leave logs.");
  }
  return response.data;
}
