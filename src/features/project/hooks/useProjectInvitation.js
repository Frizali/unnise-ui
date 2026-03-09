import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { invitationService } from "../../../services/invitationService";
import { useAlert } from "../../../context/AlertContext";

export function useProjectInvitation() {
  const { token } = useParams();
  const showAlert = useAlert();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInvitation = useCallback(async () => {
    setLoading(true);

    try {
      const res = await invitationService.getByToken(token);
      setInvitation(res);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  });

  const acceptInvitation = async () => {
    setLoading(true);

    try {
      await invitationService.acceptInvitation({ token });
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  return { invitation, loading, acceptInvitation };
}
