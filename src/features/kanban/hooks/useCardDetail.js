import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import { projectService } from "../../../services/projectService";
import { cardService } from "../../../services/cardService";

const DETAIL_TABS = [
  { label: "Comments", value: "comments" },
  { label: "Files", value: "files" },
  { label: "Activity Log", value: "activity" },
];

export function useCardDetail({ isOpen, setIsOpen }) {
  const { id: projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("comments");
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [labels, setLabels] = useState([]);
  const [project, setProject] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const showAlert = useAlert();

  const cardId = searchParams.get("card");
  const isDialogOpen = isOpen && !!cardId;
  const isLoading = loadingCount > 0;

  const closeDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("card");
    setSearchParams(params);
    setIsOpen(false);
  };

  const withLoading = useCallback(async (request) => {
    setLoadingCount((prev) => prev + 1);
    try {
      return await request();
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  const loadProject = useCallback(async () => {
    try {
      const data = await withLoading(() => projectService.getById(projectId));
      setProject(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  }, [projectId, showAlert, withLoading]);

  const loadProjectMembers = useCallback(async () => {
    try {
      const data = await withLoading(() => projectService.getMembers(projectId));
      setMembers(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  }, [projectId, showAlert, withLoading]);

  const loadProjectLabels = useCallback(async () => {
    try {
      const data = await withLoading(() => projectService.getLabels(projectId));
      setLabels(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  }, [projectId, showAlert, withLoading]);

  const saveCardAssignees = async (assigneeIds) => {
    try {
      await cardService.setCardAssignees(projectId, cardId, assigneeIds);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  };

  const saveCardLabels = async (labelIds) => {
    try {
      await cardService.setCardLabels(projectId, cardId, labelIds);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  };

  const loadCardComments = useCallback(async () => {
    try {
      const data = await withLoading(() =>
        cardService.getCardComments(projectId, cardId),
      );
      setComments(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  }, [cardId, projectId, showAlert, withLoading]);

  useEffect(() => {
    if (!isDialogOpen) return;
    loadProjectMembers();
    loadProjectLabels();
    loadProject();
    loadCardComments();
  }, [
    isDialogOpen,
    projectId,
    cardId,
    loadProjectMembers,
    loadProjectLabels,
    loadProject,
    loadCardComments,
  ]);

  return {
    cardId,
    isDialogOpen,
    isLoading,
    activeTab,
    setActiveTab,
    members,
    comments,
    projectLabels: labels,
    project,
    closeDetail,
    saveCardAssignees,
    saveCardLabels,
    DETAIL_TABS,
  };
}
