import { apiRequest } from './api';

export async function getAllIncidents() {
  return apiRequest('/incidentList');
}

export async function getIncidentById(id) {
  return apiRequest(`/incident/${id}`);
}

export async function saveIncident(incident) {
  return apiRequest('/incidentSave', {
    method: 'POST',
    body: incident,
  });
}

export async function updateIncident(id, incident) {
  return apiRequest(`/incidentUpdate/${id}`, {
    method: 'PUT',
    body: incident,
  });
}

export async function deleteIncident(id) {
  return apiRequest(`/incidentDelete/${id}`, {
    method: 'DELETE',
  });
}

// Métodos de filtros
export async function getIncidentsByArea(area) {
  return apiRequest(`/incidentsByArea?area=${encodeURIComponent(area)}`);
}

export async function getIncidentsByPriority(priorityLevel) {
  return apiRequest(`/incidentsByPriority?priorityLevel=${encodeURIComponent(priorityLevel)}`);
}

export async function getIncidentsByUser(userId) {
  return apiRequest(`/incidentsByUser/${userId}`);
}

export async function getIncidentsByCategory(categoryId) {
  return apiRequest(`/incidentsByCategory/${categoryId}`);
}

export async function getIncidentsByDepartment(departmentId) {
  return apiRequest(`/incidentsByDepartment/${departmentId}`);
}