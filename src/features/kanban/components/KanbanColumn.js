import { KanbanCard } from "./KanbanCard";
import { useState } from "react";
import { AddCardModal } from "./AddCardModal";
import { Typography } from "@mui/material";

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onMoveCard,
  allColumns,
  isColOver,
  cardDropTargetId,
  onColHeaderDragStart,
  onColHeaderDragEnd,
  onColDragOver,
  onColDrop,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOverCard,
  onCardDropOnCard,
  onCardDropOnColumn,
}) {
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onColDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onColDrop(column.id);
      }}
      style={{
        flex: "1 1 240px",
        minWidth: 240,
        maxWidth: 300,
        // background: isColOver ? "#1a1a30" : "#16162a",
        border: `1px solid ${isColOver ? column.color + "70" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 16,
        padding: "16px 14px",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {/* Draggable header */}
      <div
        draggable
        onDragStart={(e) => {
          onColHeaderDragStart(e, column.id);
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          onColHeaderDragEnd(e);
          setIsDragging(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          cursor: "grab",
          userSelect: "none",
          padding: "4px 2px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2.5,
            opacity: 0.4,
            flexShrink: 0,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "icon.primary",
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: column.color,
            boxShadow: `0 0 8px ${column.color}`,
            flexShrink: 0,
          }}
        />
        <Typography variant="body2" color="text.primary" fontWeight={500}>{column.label}</Typography>

        <span
          style={{
            background: column.color + "22",
            color: column.color,
            borderRadius: 20,
            padding: "1px 8px",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          {cards.length}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 60 }}>
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onMoveCard={onMoveCard}
            columns={allColumns}
            isDropTarget={cardDropTargetId === card.id}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onDragOver={onCardDragOverCard}
            onDrop={onCardDropOnCard}
          />
        ))}
        {cards.length === 0 && (
          <div
            style={{
              border: `1px dashed ${isColOver ? column.color + "80" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 10,
              padding: "24px 0",
              textAlign: "center",
              color: isColOver ? column.color : "#334155",
              fontSize: 12,
              fontFamily: "'Sora',sans-serif",
              transition: "all 0.15s",
            }}
          >
            {isColOver ? "Release to drop" : "Drop cards here"}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        style={{
          marginTop: 12,
          width: "100%",
          padding: "9px 0",
          borderRadius: 10,
          border: `1px dashed ${column.color}55`,
          background: "transparent",
          color: column.color + "bb",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "'Sora',sans-serif",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = column.color + "11";
          e.currentTarget.style.borderStyle = "solid";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderStyle = "dashed";
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 300, lineHeight: 1 }}>+</span>{" "}
        Add Card
      </button>
      {showModal && (
        <AddCardModal
          columnId={column.id}
          onAdd={onAddCard}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
