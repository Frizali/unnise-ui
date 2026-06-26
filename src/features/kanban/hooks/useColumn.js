import { useCallback, useState, useEffect } from "react";
import { columnService } from "../../../services/columnService";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import hubClient from "../../../lib/hubClient";

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

  useEffect(() => {
    if (!projectId) return;

    hubClient.joinProjectRoom(projectId).catch(() => {});

    const handleColumnCreated = (column) => {
      console.log("Column created:", column);
      setColumns((prev) => {
        if (prev.find((c) => c.id === column.id)) return prev;
        return [...prev, column];
      });
    };

    const handleColumnsReordered = (items) => {
      setColumns((prev) => {
        const mapped = prev.map((c) => {
          const item = items.find((i) => i.id === c.id);
          return item ? { ...c, position: item.position } : c;
        });
        return mapped.sort((a, b) => a.position - b.position);
      });
    };

    const handleColumnUpdated = (updatedColumn) => {
      setColumns((prev) =>
        prev.map((column) =>
          column.id === updatedColumn.id ? { ...column, ...updatedColumn } : column
        )
      );
    };

    const handleColumnDeleted = (columnId) => {
      setColumns((prev) => prev.filter((column) => column.id !== columnId));
    };

    hubClient.on("ColumnCreated", handleColumnCreated);
    hubClient.on("ColumnsReordered", handleColumnsReordered);
    hubClient.on("ColumnUpdated", handleColumnUpdated);
    hubClient.on("ColumnDeleted", handleColumnDeleted);

    return () => {
      hubClient.off("ColumnCreated", handleColumnCreated);
      hubClient.off("ColumnsReordered", handleColumnsReordered);
      hubClient.off("ColumnUpdated", handleColumnUpdated);
      hubClient.off("ColumnDeleted", handleColumnDeleted);
      hubClient.leaveProjectRoom(projectId).catch(() => {});
    };
  }, [projectId]);

  const reorderColumns = async (reorderedColumns) => {
    try {
      await hubClient.invoke("ReorderColumns", {
        projectId,
        columns: reorderedColumns.map(({ id, position }) => ({ id, position })),
      });
    } catch {
      loadColumns();
    }
  };

  const createColumn = async (columnData) => {
    try {
      return await hubClient.invoke("CreateColumn", {
        projectId,
        title: columnData.title,
        description: columnData.description ?? null,
        color: columnData.color,
      });
    } catch {
      loadColumns();
    }
  };

  const addColumn = async (columnData) => {
    await createColumn(columnData);
  };

  const updateColumn = async (columnId, updates) => {
    const normalizedUpdates = typeof updates === "string" ? { title: updates } : updates;
    const currentColumn = columns.find((column) => column.id === columnId);

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId ? { ...column, ...normalizedUpdates } : column
      )
    );

    try {
      await hubClient.invoke("UpdateColumn", {
        projectId,
        columnId,
        title: normalizedUpdates.title ?? currentColumn?.title ?? null,
        description: normalizedUpdates.description ?? currentColumn?.description ?? null,
        color: normalizedUpdates.color ?? currentColumn?.color ?? null,
      });
    } catch (err) {
      showAlert("Unable to update column", err.message ?? "Please try again", "error");
      loadColumns();
    }
  };

  const deleteColumn = async (columnId) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId));

    try {
      await hubClient.invoke("DeleteColumn", {
        projectId,
        columnId,
      });
    } catch (err) {
      showAlert("Unable to delete column", err.message ?? "Please try again", "error");
      loadColumns();
    }
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
    updateColumn,
    deleteColumn,
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