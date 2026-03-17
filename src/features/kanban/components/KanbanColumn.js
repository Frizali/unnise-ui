import { KanbanCard } from "./KanbanCard";
import { useState } from "react";
import { AddCardModal } from "./AddCardModal";
import { Typography, Box, TextField, Tooltip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import { ClickAwayListener } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

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
  const [isHover, setIsHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragOver={(e) => {
        e.preventDefault();
        onColDragOver(column.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onColDrop(column.id);
      }}
      style={{
        flex: "1 1 300px",
        minWidth: 300,
        maxWidth: 350,
        border: `${isColOver ? "2px" : "1px"} solid ${isColOver ? column.color : "#D9D9D9"}`,
        borderRadius: 6,
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        opacity: isDragging ? 0.8 : 1,
        background: "#FCFBFC",
      }}
    >
      {/* Draggable header */}
      <Box
        draggable
        onDragStart={(e) => {
          onColHeaderDragStart(e, column.id);
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          onColHeaderDragEnd(e);
          setIsDragging(false);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "grab",
          userSelect: "none",
          padding: "12px 20px",
          borderBottom: `${isColOver ? "2px" : "1px"} solid ${isColOver ? column.color : "#D9D9D9"}`,
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Box
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: column.color,
              boxShadow: `0 0 8px ${column.color}`,
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {column.title}
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {cards.length}
          </Typography>

          {/* <span
            style={{
              background: column.color + "22",
              color: column.color,
              borderRadius: 20,
              padding: "1px 8px",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {cards.length}
          </span> */}
        </Box>
        <Box display="flex" gap={0.5}>
          <UiButtonIcon
            onClick={() => setShowModal(true)}
            title="Create task"
            size="small"
          >
            <AddOutlinedIcon
              fontSize="small"
              sx={{ color: isHover ? "icon.main" : "transparent" }}
            />
          </UiButtonIcon>
          <UiButtonIcon title="More actions" size="small">
            <MoreHorizOutlinedIcon
              fontSize="small"
              sx={{ color: isHover ? "icon.main" : "transparent" }}
            />
          </UiButtonIcon>
        </Box>
      </Box>

      <Box style={{ flex: 1, minHeight: 60, padding: "12px 1rem" }}>
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onMoveCard={onMoveCard}
            column={column}
            columns={allColumns}
            isDropTarget={cardDropTargetId === card.id}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onDragOver={onCardDragOverCard}
            onDrop={onCardDropOnCard}
          />
        ))}

        {cards.length === 0 && (
          <Typography variant="body2" color="text.primary">
            {column.description}
          </Typography>
        )}
        {showModal && (
          <ClickAwayListener onClickAway={() => setShowModal(false)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                gap: 1,
                border: "2px solid #D9D9D9",
                borderRadius: "6px",
                padding: "4px 8px",

                // efek focus (saat TextField aktif)
                "&:focus-within": {
                  borderColor: "primary.main",
                },
              }}
            >
              <TextField
                autoFocus
                multiline
                rows={2}
                placeholder="Add a task... (Press Enter to save)"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },

                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                    padding: "4px 0",
                  },
                }}
              />

              <Tooltip title="Press Enter to save">
                <UiButtonIcon size="small">
                  <KeyboardReturnIcon fontSize="small" />
                </UiButtonIcon>
              </Tooltip>
            </Box>
          </ClickAwayListener>
        )}
      </Box>

      {/* {showModal && (
        <AddCardModal
          columnId={column.id}
          onAdd={onAddCard}
          onClose={() => setShowModal(false)}
        />
      )} */}
    </Box>
  );
}
