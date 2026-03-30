import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import { useParams } from "react-router-dom";
import { projectService } from "../../../services/projectService";
import { cardService } from "../../../services/cardService";

const TABS = [
  { label: "Commments", value: "comments" },
  { label: "Files", value: "files" },
  { label: "Activity Log", value: "activity" },
];

export function useCardDetail({ showDetail, setShowDetail }) {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState("comments");
  const [members, setMembers] = useState([]);
  const [projectLabels, setProjectLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const cardId = searchParams.get("card");
  const isOpen = showDetail && !!cardId;
  const showAlert = useAlert();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("card");
    setSearchParams(params);
    setShowDetail(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    getProjectMembers();
    getLabels();
  }, [isOpen]);

  const getProjectMembers = async () => {
    setLoading(true);

    try {
      var members = await projectService.getMembers(id);
      setMembers(members);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  };

  const getLabels = async () => {
    setLoading(true);

    try {
      var labels = await projectService.getLabels(id);
      setProjectLabels(labels);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  };

  const setCardAssignees = async (payload) => {
    try {
      await cardService.setCardAssignees(id, cardId, payload);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  };

  const setCardLabels = async (payload) => {
    try {
      await cardService.setCardLabels(id, cardId, payload);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    }
  };

  return {
    cardId,
    isOpen,
    TABS,
    currentTab,
    members,
    projectLabels,
    handleClose,
    setCurrentTab,
    setCardAssignees,
    setCardLabels
  };
}
