import { apiRequest } from './api';

export async function getAllDepartments() {
  return apiRequest('/departmentList');
}

export async function saveDepartment(department) {
  return apiRequest('/departmentSave', {
    method: "POST",
    body: department,
  });
}

export async function updateDepartment(id, department) {
  return apiRequest(`/departmentUpdate/${id}`, {
    method: "PUT",
    body: department,
  });
}

export async function deleteDepartment(id) {
  return apiRequest(`/departmentDelete/${id}`, {
    method: "DELETE",
  });
}