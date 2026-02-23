import { useState } from "react";
import { authService } from "../../../services/authService";
import { useAlert } from "../../../context/AlertContext";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const showAlert = useAlert();
  const [loading, setLoading] = useState(false);
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

    try {
      await authService.register(form);
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
    register,
  };
};
