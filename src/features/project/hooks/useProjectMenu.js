import { useState, useCallback, useEffect } from "react";
import { projectService } from "../../../services/projectService";
import { useNavigate } from "react-router-dom";

export const useProjectMenu = () => {
  const [openMenu, setOpenMenu] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleOpenMenu() {
    setOpenMenu(!openMenu);
  }

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectService.projects();
      setProjects(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    openMenu,
    handleOpenMenu,
    fetchProjects,
    navigate,
  };
};
