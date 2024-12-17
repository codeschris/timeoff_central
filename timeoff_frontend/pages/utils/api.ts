import axios from 'axios';

interface LoginResponse {
  token: string;
  message: string;
}

interface LoginError {
  error: string;
}

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
  const response = await API.get('/employees/'); // No need for Authorization header
  return response.data;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await API.post<LoginResponse>('/login/', { email, password });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (error.response.data as LoginError) || { error: 'Something went wrong' };
    } else {
      throw { error: 'Something went wrong' };
    }
  }
};