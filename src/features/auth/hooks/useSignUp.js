import { useState } from "react";
import { authService } from "../services/authService";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    globalName: "",
    username: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const register = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(form);
    } catch (err) {
        setValidationError(err.validation);
        setError(err.detail || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    validationError,
    handleChange,
    register,
  };
};
