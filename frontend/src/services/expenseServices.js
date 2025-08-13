import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function createExpense(expenseData) {
  const response = await axios.post(`${BASE_URL}/api/expenses`, expenseData);
  return response.data;
}

export async function getExpenses(skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/expenses?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getExpenseById(id) {
  const response = await axios.get(`${BASE_URL}/api/expenses/${id}`);
  return response.data;
}

export async function getUserExpenses(userId, skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/users/${userId}/expenses?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getFlaggedExpenses(skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/expenses/flagged?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getUserFlaggedExpenses(userId, skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/users/${userId}/expenses/flagged?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function updateExpense(id, expenseData) {
  const response = await axios.patch(`${BASE_URL}/api/expenses/${id}`, expenseData);
  return response.data;
}

export async function bulkUpdateExpenses(ids, expenseData) {
  const response = await axios.patch(`${BASE_URL}/api/expenses/bulk`, { ids, ...expenseData });
  return response.data;
}

export async function deleteExpense(id) {
  const response = await axios.delete(`${BASE_URL}/api/expenses/${id}`);
  return response.data;
}

export async function uploadExpensesCSV(userId, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${BASE_URL}/api/users/${userId}/upload-expenses`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}