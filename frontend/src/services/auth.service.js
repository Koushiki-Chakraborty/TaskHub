import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.success && response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

const signup = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });
  if (response.success && response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

const getMe = async () => {
  return await api.get("/auth/me");
};

const updateProfile = async (profileData) => {
  // profileData will be { name, email }
  return await api.put("/auth/me", profileData);
};

const logout = () => {
  localStorage.removeItem("token");
};

export default {
  login,
  signup,
  getMe,
  updateProfile,
  logout,
};
