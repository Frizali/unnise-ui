import { useRef, useState } from "react";

export function useDragAndDrop({ onCardDropOnColumn, onCardDropOnCard, onColumnSwap }) {
  const dragRef = useRef({ type: null, cardId: null, columnId: null });
  const [hoveredColumnId, setHoveredColumnId] = useState(null);
  const [dropTargetCardId, setDropTargetCardId] = useState(null);

  const handleColumnDragStart = (e, columnId) => {
    dragRef.current = { type: "column", columnId, cardId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `col:${columnId}`);
  };

  const handleColumnDragEnd = () => {
    dragRef.current = { type: null, columnId: null, cardId: null };
    setHoveredColumnId(null);
  };

  const handleCardDragStart = (e, cardId) => {
    dragRef.current = { type: "card", cardId, columnId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `card:${cardId}`);
  };

  const handleCardDragEnd = () => {
    dragRef.current = { type: null, cardId: null, columnId: null };
    setDropTargetCardId(null);
    setHoveredColumnId(null);
  };

  const handleDragOverColumn = (columnId) => {
    const { type, columnId: draggingColId } = dragRef.current;
    if (type === "column" && draggingColId !== columnId) {
      setHoveredColumnId(columnId);
    } else if (type === "card") {
      setHoveredColumnId(columnId);
    }
  };

  const handleDragOverCard = (targetCardId) => {
    const { type, cardId } = dragRef.current;
    if (type === "card" && cardId !== targetCardId) {
      setDropTargetCardId(targetCardId);
    }
  };

  const handleDropOnColumn = (targetColumnId) => {
    const { type, columnId: sourceColumnId, cardId: sourceCardId } = dragRef.current;

    if (type === "column") {
      if (sourceColumnId && sourceColumnId !== targetColumnId) {
        onColumnSwap(sourceColumnId, targetColumnId);
      }
      dragRef.current = { type: null, columnId: null, cardId: null };
      setHoveredColumnId(null);
      return;
    }

    if (type === "card" && sourceCardId) {
      onCardDropOnColumn(sourceCardId, targetColumnId);
      dragRef.current = { type: null, columnId: null, cardId: null };
      setDropTargetCardId(null);
      setHoveredColumnId(null);
    }
  };

  const handleDropOnCard = (targetCardId) => {
    const { type, cardId: sourceCardId } = dragRef.current;
    if (type !== "card") return;
    if (!sourceCardId || sourceCardId === targetCardId) {
      setDropTargetCardId(null);
      return;
    }

    onCardDropOnCard(sourceCardId, targetCardId);
    dragRef.current = { type: null, cardId: null, columnId: null };
    setDropTargetCardId(null);
    setHoveredColumnId(null);
  };

  const resetDrag = () => {
    setHoveredColumnId(null);
    setDropTargetCardId(null);
    dragRef.current = { type: null, cardId: null, columnId: null };
  };

  return {
    hoveredColumnId,
    dropTargetCardId,
    handleColumnDragStart,
    handleColumnDragEnd,
    handleCardDragStart,
    handleCardDragEnd,
    handleDragOverColumn,
    handleDragOverCard,
    handleDropOnColumn,
    handleDropOnCard,
    resetDrag,
  };
}