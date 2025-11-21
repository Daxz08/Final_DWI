import { apiRequest } from './api';

export async function getAllCategories() {
  return apiRequest('/categoryList');
}

export async function saveCategory(category) {
  return apiRequest('/categorySave', {
    method: "POST",
    body: category,
  });
}

export async function updateCategory(id, category) {
  return apiRequest(`/categoryUpdate/${id}`, {
    method: "PUT",
    body: category,
  });
}

export async function deleteCategory(id) {
  return apiRequest(`/categoryDelete/${id}`, {
    method: "DELETE",
  });
}