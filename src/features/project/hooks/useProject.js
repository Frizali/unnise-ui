import { useState } from "react";
import { projectService } from "../../../services/projectService";
import { useAlert } from "../../../context/AlertContext";

export function useProject() {
  const showAlert = useAlert();
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  function handleOpen(){
    setOpen(!open);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function create() {
    setLoading(true);

    try {
      await projectService.create(project);
    } catch (err) {
      setValidationError(err.validation);
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  }

  async function checkName() {
    setLoading(true);

    try {
      await projectService.checkName(project);
    } catch (err) {
      setValidationError(err.validation);
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  }

  return {
    project,
    loading,
    open,
    validationError,
    checkName,
    create,
    handleChange,
    handleOpen
  };
}
