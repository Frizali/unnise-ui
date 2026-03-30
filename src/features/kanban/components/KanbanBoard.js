import { useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { KanbanColumn } from "./KanbanColumn";
import { AddColumnModal } from "./AddColumnModal";
import { KanbanBoardFilter } from "./KanbanBoardFilter";
import { useCard } from "../hooks/useCard";
import { useColumn } from "../hooks/useColumn";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import loadingGif from "../../../assets/Unnise-Loader.gif";

export default function KanbanBoard() {
  const { id: projectId } = useParams();
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const {
    cards,
    isLoading: cardsLoading,
    addCard,
    updateCard,
    deleteCard,
    moveCardToColumn,
    reorderCardWithinColumn,
    moveCardToColumnByDrop,
    getCardsByColumn,
  } = useCard();

  const {
    columns,
    isLoading: columnsLoading,
    addColumn,
    swapColumnPositions,
  } = useColumn();

  const {
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
  } = useDragAndDrop({
    onColumnSwap: swapColumnPositions,
    onCardDropOnColumn: (cardId, columnId) =>
      moveCardToColumnByDrop(cardId, columnId, projectId),
    onCardDropOnCard: (sourceId, targetId) =>
      reorderCardWithinColumn(sourceId, targetId, projectId),
  });

  if (cardsLoading || columnsLoading) {
    return (
      <Box sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={loadingGif} alt="loading" width="60" style={{ borderRadius: "6px" }} />
      </Box>
    );
  }

  return (
    <>
      <KanbanBoardFilter columns={columns} cards={cards} />
      <div style={{ height: "100%", overflowX: "auto" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            padding: "12px 36px",
            overflowX: "auto",
            alignItems: "flex-start",
            height: "100%",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={resetDrag}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={getCardsByColumn(column.id)}
              allColumns={columns}
              onAddCard={addCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onMoveCard={moveCardToColumn}
              isHoveredByDrag={hoveredColumnId === column.id}
              dropTargetCardId={dropTargetCardId}
              onColumnDragStart={handleColumnDragStart}
              onColumnDragEnd={handleColumnDragEnd}
              onDragOverColumn={handleDragOverColumn}
              onDropOnColumn={handleDropOnColumn}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onDragOverCard={handleDragOverCard}
              onDropOnCard={handleDropOnCard}
              onDropCardOnColumn={handleDropOnColumn}
            />
          ))}

          <UiButtonIcon
            title="Add a new column"
            bordered={true}
            onClick={() => setIsAddColumnOpen(true)}
          >
            <AddOutlinedIcon />
          </UiButtonIcon>

          <AddColumnModal
            isOpen={isAddColumnOpen}
            onClose={() => setIsAddColumnOpen(false)}
            onAddColumn={addColumn}
          />
        </div>
      </div>
    </>
  );
}