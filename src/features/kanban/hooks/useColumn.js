import { useCallback, useState, useEffect } from "react";
import { columnService } from "../../../services/columnService";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";

const COLOR_OPTIONS = [
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

export function useColumn({onAddColumn}) {
  const { id } = useParams();
  const [column, setColumn] = useState({});
  const [color, setColor] = useState("#010101");
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const showAlert = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setColumn((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchColumns = useCallback(async () => {
    setColumnsLoading(true);

    try {
      const res = await columnService.getByProject(id);
      setColumns(res);
    } catch (err) {
      showAlert(err.title, err.detail, "error");
    } finally {
      setColumnsLoading(false);
    }
  });

  const reorder = async (columns) => {
    try {
      await columnService.reorder(id, columns);
    } catch (err) {
      fetchColumns();
    }
  };

  useEffect(() => {
    fetchColumns();
  }, [id]);

  const createColumn = async (column) => {
    try {
      return await columnService.create(id, { projectId: id, ...column });
    } catch (error) {
      fetchColumns();
    }
  };

  const create = async () => {
    await onAddColumn({...column, color})
  }

  return {
    columns,
    setColumns,
    columnsLoading,
    reorder,
    createColumn,
    color,
    setColor,
    COLOR_OPTIONS,
    handleChange,
    create
  };
}
