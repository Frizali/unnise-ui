import { invitationService } from "../../../services/invitationService";
import { projectService } from "../../../services/projectService";
import { useAlert } from "../../../context/AlertContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function useProjectInviteMember({inviteDialog}) {
  const { id } = useParams();
  const [options, setOptions] = useState([]);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [membersLooading, setMembersLooading] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const showAlert = useAlert();

  const handleOptionChange = (selectedOption) => {
    setSelected(selectedOption);
  };

  const handleKeywordChange = (newKeyword) => {
    setKeyword(newKeyword);
  };

  const fetchSuggestions = async () => {
    setLoading(true);

    try {
      const res = await invitationService.getMemberSuggestions({
        projectId: id,
        keyword,
      });
      setOptions(res);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!keyword) {
      setOptions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    if (!inviteDialog) return;

    getProjectMembers();
  }, [inviteDialog]);

  const handleSendInvite = async () => {
    setSendingInvite(true);

    try {
      await invitationService.create({
        projectId: id,
        userId: selected,
      });
      showAlert("Success", "Invitation sent successfully", "success");
      await fetchSuggestions();
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setSendingInvite(false);
    }
  };

  const getProjectMembers = async () => {
    setMembersLooading(true);

    try {
      var members = await projectService.getMembers(id);
      setMembers(members);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setMembersLooading(false);
    }
  };

  return {
    options,
    keyword,
    loading,
    sendingInvite,
    members,
    membersLooading,
    handleOptionChange,
    handleKeywordChange,
    handleSendInvite,
  };
}
