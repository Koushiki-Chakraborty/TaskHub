import api from "./api";

const getAllTasks = async (params) => {
  // params can include search, status, etc.
  return await api.get("/tasks", { params });
};

const getSingleTask = async (id) => {
  return await api.get(`/tasks/${id}`);
};

const createTask = async (taskData) => {
  return await api.post("/tasks", taskData);
};

const updateTask = async (id, taskData) => {
  return await api.put(`/tasks/${id}`, taskData);
};

const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

export default {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
};
