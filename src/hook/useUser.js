import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";

// Hook kiểm tra người dùng hiện tại
function useUser() {
  const [currentUser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🛑 Nếu không có token thì không gọi getUser
    if (!token) {
      setLoading(false); // Không loading nữa
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await AuthService.getUser();
        setUser(data);
      } catch (error) {
        setError(error);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
  };
}

export default useUser;
