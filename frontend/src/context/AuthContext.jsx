import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth failed", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      return { success: false, message: errorMsg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authService.signup(name, email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Signup failed" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed";
      return { success: false, message: errorMsg };
    }
  };

  const updateUser = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || "Update failed" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Update failed";
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
