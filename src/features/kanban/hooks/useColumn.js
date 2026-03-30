import { useCallback, useState, useEffect } from "react";
import { columnService } from "../../../services/columnService";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";

export const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#ec4899", label: "Pink" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f97316", label: "Orange" },
  { value: "#a3e635", label: "Lime" },
];

export function useColumn() {
  const { id: projectId } = useParams();
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = useAlert();

  const loadColumns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await columnService.getByProject(projectId);
      setColumns(data);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadColumns();
  }, [projectId]);

  const reorderColumns = async (reorderedColumns) => {
    try {
      await columnService.reorder(projectId, reorderedColumns);
    } catch {
      loadColumns();
    }
  };

  const createColumn = async (columnData) => {
    try {
      return await columnService.create(projectId, { projectId, ...columnData });
    } catch {
      loadColumns();
    }
  };

  const addColumn = async (columnData) => {
    const nextPosition =
      columns.length > 0 ? Math.max(...columns.map((c) => c.position)) + 1 : 1;

    const newColumn = { ...columnData, position: nextPosition };
    const created = await createColumn(newColumn);
    if (created) setColumns((prev) => [...prev, created]);
  };

  const swapColumnPositions = (sourceId, targetId) => {
    setColumns((prev) => {
      const arr = [...prev];
      const sourceIndex = arr.findIndex((c) => c.id === sourceId);
      const targetIndex = arr.findIndex((c) => c.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const [moved] = arr.splice(sourceIndex, 1);
      arr.splice(targetIndex, 0, moved);

      const updated = arr.map((col, i) => ({ ...col, position: i + 1 }));
      reorderColumns(updated);
      return updated;
    });
  };

  return {
    columns,
    setColumns,
    isLoading,
    addColumn,
    swapColumnPositions,
    reorderColumns,
    createColumn,
  };
}

export function useColumnForm({ onSubmit } = {}) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [color, setColor] = useState("#010101");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit?.({ ...form, color });
  };

  const reset = () => {
    setForm({ title: "", description: "" });
    setColor("#010101");
  };

  return { form, color, setColor, handleChange, handleSubmit, reset };
}