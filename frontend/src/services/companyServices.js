import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function createCompany(companyData) {
  const response = await axios.post(`${BASE_URL}/api/companies`, companyData);
  return response.data;
}

export async function getCompanies(skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/companies?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getCompanyById(id) {
  const response = await axios.get(`${BASE_URL}/api/companies/${id}`);
  return response.data;
}

export async function updateCompany(id, companyData) {
  const response = await axios.patch(`${BASE_URL}/api/companies/${id}`, companyData);
  return response.data;
}

export async function deleteCompany(id) {
  const response = await axios.delete(`${BASE_URL}/api/companies/${id}`);
  return response.data;
}

export async function getCompanyUsers(companyId, skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/companies/${companyId}/users?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getCompanyExpenses(companyId, skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/companies/${companyId}/expenses?skip=${skip}&limit=${limit}`);
  return response.data;
}