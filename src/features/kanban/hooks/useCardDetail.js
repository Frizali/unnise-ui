import { useEffect, useState } from "react";
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
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = useAlert();

  const cardId = searchParams.get("card");
  const isDialogOpen = isOpen && !!cardId;

  const closeDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("card");
    setSearchParams(params);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isDialogOpen) return;
    loadProjectMembers();
    loadProjectLabels();
  }, [isDialogOpen]);

  const loadProjectMembers = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getMembers(projectId);
      setMembers(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectLabels = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getLabels(projectId);
      setLabels(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setIsLoading(false);
    }
  };

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

  return {
    cardId,
    isDialogOpen,
    isLoading,
    activeTab,
    setActiveTab,
    members,
    projectLabels: labels,
    closeDetail,
    saveCardAssignees,
    saveCardLabels,
    DETAIL_TABS,
  };
}