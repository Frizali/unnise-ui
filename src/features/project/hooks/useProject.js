import { useState, useEffect } from "react";
import { projectService } from "../../../services/projectService";
import { useAlert } from "../../../context/AlertContext";

export function useProject() {
  const showAlert = useAlert();
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [nameAvailable, setNameAvailable] = useState({
    isAvailable: true,
    reason: "",
  });

  function handleOpen() {
    setOpen(!open);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    console.log(name);

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

  useEffect(() => {
    if (!project.name) return;

    const timeout = setTimeout(() => {
      checkName();
    }, 500);

    return () => clearTimeout(timeout);
  }, [project.name]);

  async function checkName() {
    setLoading(true);

    try {
      var res = await projectService.checkName(project);
      setNameAvailable(res);
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
    nameAvailable,
    validationError,
    checkName,
    create,
    handleChange,
    handleOpen,
  };
}
