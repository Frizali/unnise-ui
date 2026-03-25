import { useCallback, useEffect, useState } from "react";
import { projectService } from "../../../services/projectService";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";

export function useProjectHeader() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const showAlert = useAlert();

  const handleInviteDialog = () => {
    setInviteDialog(!inviteDialog)
  }

  const fetchProject = useCallback(async () => {
    setLoading(true);

    try {
      const res = await projectService.getById(id);
      setProject(res);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  return { project, loading, inviteDialog, handleInviteDialog };
}
