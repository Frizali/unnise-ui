import { useState } from "react";
import { authService } from "../services/authService";

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState({});

  const [form, setForm] = useState({
    identity: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const login = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(form);
    } catch (err) {
      setValidationError(err.validation);
      setError(err.detail || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    validationError,
    handleChange,
    login,
  };
};
