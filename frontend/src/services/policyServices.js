import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function createPolicy(policyData) {
  const response = await axios.post(`${BASE_URL}/api/policies`, policyData);
  return response.data;
}

export async function getPolicies(skip = 0, limit = 100) {
  const response = await axios.get(`${BASE_URL}/api/policies?skip=${skip}&limit=${limit}`);
  return response.data;
}

export async function getPolicyById(id) {
  const response = await axios.get(`${BASE_URL}/api/policies/${id}`);
  return response.data;
}

export async function updatePolicy(id, policyData) {
  const response = await axios.patch(`${BASE_URL}/api/policies/${id}`, policyData);
  return response.data;
}

export async function deletePolicy(id) {
  const response = await axios.delete(`${BASE_URL}/api/policies/${id}`);
  return response.data;
}