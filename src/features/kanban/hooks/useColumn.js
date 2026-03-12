import { useCallback, useState, useEffect } from "react";
import { columnService } from "../../../services/columnService";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";

export function useColumn() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const showAlert = useAlert();

  const fetchColumn = useCallback(async () => {
    setLoading(true);

    try {
      const res = await columnService.getByProject(id);
      setColumns(res);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchColumn();
  }, [id]);

  return { columns, setColumns, loading };
}
