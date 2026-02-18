import { useState } from "react";
import { authService } from "../services/authService";
import { useAlert } from "../../../context/AlertContext";

export const useSignIn = () => {
  const showAlert = useAlert();
  const [loading, setLoading] = useState(false);
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

    try {
      const response = await authService.login(form);
      localStorage.setItem("accessToken", response);
    } catch (err) {
      setValidationError(err.validation);
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    validationError,
    handleChange,
    login,
  };
};
