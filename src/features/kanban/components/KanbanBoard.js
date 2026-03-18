import { useState, useRef } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { useColumn } from "../hooks/useColumn";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { AddColumnModal } from "./AddColumnModal";
import { useCard } from "../hooks/useCard";
import loadingGif from "../../../assets/Unnise-Loader.gif";
import { Box } from "@mui/material";
import { cardService } from "../../../services/cardService";
import { useParams } from "react-router-dom";

export default function KanbanBoard() {
  const { id } = useParams();
  const { columns, columnsLoading, setColumns, reorder, createColumn } = useColumn({});
  const { cards, cardsLoading, setCards } = useCard();

  const [showModal, setShowModal] = useState(false);
  const dragRef = useRef({ type: null, cardId: null, columnId: null });
  const [overCol, setOverCol] = useState(null);
  const [cardDropTarget, setCardDropTarget] = useState(null);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const addCard = (card) =>
    setCards((prev) => {
      const pos = prev.filter((c) => c.column === card.column).length;
      return [...prev, { ...card, position: pos }];
    });
  const deleteCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id));
  const moveToColumn = (cardId, colId) =>
    setCards((prev) => {
      const pos = prev.filter((c) => c.column === colId).length;
      return prev.map((c) =>
        c.id === cardId ? { ...c, column: colId, position: pos } : c,
      );
    });

  const handleColHeaderDragStart = (e, columnId) => {
    dragRef.current = { type: "column", columnId, cardId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `col:${columnId}`);
  };

  const addColumn = async (column) => {
    try {
      const pos =
        columns.length > 0
          ? Math.max(...columns.map((c) => c.position)) + 1
          : 1;

      const newColumn = {
        ...column,
        position: pos,
      };

      var res = await createColumn(newColumn);

      setColumns((prev) => [...prev, res]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleColHeaderDragEnd = () => {
    dragRef.current = { type: null, columnId: null, cardId: null };
    setOverCol(null);
  };

  const handleColDragOver = (colId) => {
    const d = dragRef.current;
    if (d.type === "column" && d.columnId !== colId) {
      setOverCol(colId);
    } else if (d.type === "card") {
      setOverCol(colId);
    }
  };

  const handleColDrop = (targetColId) => {
    const d = dragRef.current;

    if (d.type === "column") {
      const srcId = d.columnId;

      if (srcId && srcId !== targetColId) {
        setColumns((prev) => {
          const arr = [...prev];

          const si = arr.findIndex((c) => c.id === srcId);
          const ti = arr.findIndex((c) => c.id === targetColId);

          if (si === -1 || ti === -1) return prev;

          const [moved] = arr.splice(si, 1);
          arr.splice(ti, 0, moved);

          const updated = arr.map((col, index) => ({
            ...col,
            position: index + 1,
          }));

          reorder(updated);

          return updated;
        });
      }

      dragRef.current = { type: null, columnId: null, cardId: null };
      setOverCol(null);
    } else if (d.type === "card") {
      const srcId = d.cardId;
      const src = cards.find((c) => c.id === srcId);

      if (srcId) {
        setCards((prev) => {
          const pos =
            prev.filter((c) => c.columnId === targetColId && c.id !== srcId)
              .length + 1;

          cardService.move(id, src.id, { cardId: src.id, columnId: targetColId, position: pos })

          return prev.map((c) =>
            c.id === srcId ? { ...c, columnId: targetColId, position: pos } : c,
          );
        });
      }

      dragRef.current = { type: null, columnId: null, cardId: null };
      setCardDropTarget(null);
      setOverCol(null);
    }
  };

  const handleCardDragStart = (e, cardId) => {
    dragRef.current = { type: "card", cardId, columnId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `card:${cardId}`);
  };

  const handleCardDragEnd = () => {
    dragRef.current = { type: null, cardId: null, columnId: null };
    setCardDropTarget(null);
    setOverCol(null);
  };

  const handleCardDragOverCard = (targetCardId) => {
    const d = dragRef.current;
    if (d.type === "card" && d.cardId !== targetCardId) {
      setCardDropTarget(targetCardId);
    }
  };

  const handleCardDropOnCard = (targetCardId) => {
    const d = dragRef.current;
    if (d.type !== "card") return;
    const srcId = d.cardId;
    if (!srcId || srcId === targetCardId) {
      setCardDropTarget(null);
      return;
    }

    setCards((prev) => {
      const target = prev.find((c) => c.id === targetCardId);
      if (!target) return prev;
      const col = target.columnId;
      const src = prev.find((c) => c.id === srcId);
      if (!src) return prev;

      let siblings = prev
        .filter((c) => c.columnId === col && c.id !== srcId)
        .sort((a, b) => a.position - b.position);

      const insertAt = siblings.findIndex((c) => c.id === targetCardId);
      siblings.splice(insertAt, 0, { ...src, columnId: col });

      const reindexed = siblings.map((c, i) => ({ ...c, position: i }));
      cardService.move(id, src.id, { cardId: src.id, columnId: col, position: reindexed.find((c) => c.id === src.id).position })

      return [
        ...prev.filter((c) => c.columnId !== col && c.id !== srcId),
        ...reindexed,
      ];
    });

    dragRef.current = { type: null, cardId: null, columnId: null };
    setCardDropTarget(null);
    setOverCol(null);
  };

  const getVisible = (colId) => {
    let r = cards
      .filter((c) => c.columnId === colId)
      .sort((a, b) => a.position - b.position);

    return r;
  };

  return (
    <>
      {cardsLoading || columnsLoading ? (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={loadingGif}
            alt="loading"
            width="60"
            style={{ borderRadius: "6px" }}
          />
        </Box>
      ) : (
        <div
          style={{
            height: "100%",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              padding: "12px 20px",
              overflowX: "auto",
              alignItems: "flex-start",
              height: "100%",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              setOverCol(null);
              setCardDropTarget(null);
              dragRef.current = { type: null, cardId: null, columnId: null };
            }}
          >
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                cards={getVisible(col.id)}
                allColumns={columns}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onMoveCard={moveToColumn}
                isColOver={overCol === col.id}
                cardDropTargetId={cardDropTarget}
                onColHeaderDragStart={handleColHeaderDragStart}
                onColHeaderDragEnd={handleColHeaderDragEnd}
                onColDragOver={handleColDragOver}
                onColDrop={handleColDrop}
                onCardDragStart={handleCardDragStart}
                onCardDragEnd={handleCardDragEnd}
                onCardDragOverCard={handleCardDragOverCard}
                onCardDropOnCard={handleCardDropOnCard}
                onCardDropOnColumn={handleColDrop}
              />
            ))}

            <UiButtonIcon
              title="Add a new column"
              bordered={true}
              onClick={handleShowModal}
            >
              <AddOutlinedIcon />
            </UiButtonIcon>

            <AddColumnModal
              showModal={showModal}
              onClose={handleShowModal}
              onAddColumn={addColumn}
            />
          </div>
        </div>
      )}
    </>
  );
}
