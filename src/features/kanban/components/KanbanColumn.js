import { useState } from "react";
import { Typography, Box, TextField, Tooltip } from "@mui/material";
import { ClickAwayListener } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { KanbanCard } from "./KanbanCard";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import { ColorSwatch } from "../../../components/Swatch/ColorSwatch";

export function KanbanColumn({
  column,
  cards,
  allColumns,
  isHoveredByDrag,
  dropTargetCardId,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onColumnDragStart,
  onColumnDragEnd,
  onDragOverColumn,
  onDropOnColumn,
  onCardDragStart,
  onCardDragEnd,
  onDragOverCard,
  onDropOnCard,
  onDropCardOnColumn,
}) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const borderColor = isHoveredByDrag ? column.color : "#D9D9D9";
  const borderWidth = isHoveredByDrag ? "2px" : "1px";

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => { e.preventDefault(); onDragOverColumn(column.id); }}
      onDrop={(e) => { e.preventDefault(); onDropOnColumn(column.id); }}
      style={{
        flex: "1 1 300px",
        minWidth: 300,
        maxWidth: 350,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: 6,
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        flexDirection: "column",
        opacity: isDragging ? 0.8 : 1,
        background: "#FCFBFC",
      }}
    >
      <ColumnHeader
        column={column}
        cardCount={cards.length}
        isHovered={isHovered}
        isHoveredByDrag={isHoveredByDrag}
        onDragStart={(e) => { onColumnDragStart(e, column.id); setIsDragging(true); }}
        onDragEnd={(e) => { onColumnDragEnd(e); setIsDragging(false); }}
        onAddClick={() => setIsAddingCard(true)}
      />

      <Box sx={{ flex: 1, minHeight: 60, padding: "12px 1rem", gap:1, display:"flex", flexDirection:"column" }}>
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            column={column}
            columns={allColumns}
            isDropTarget={dropTargetCardId === card.id}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
            onMoveCard={onMoveCard}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            onDragOver={onDragOverCard}
            onDrop={onDropOnCard}
          />
        ))}

        {cards.length === 0 && !isAddingCard && (
          <Typography variant="body2" color="text.primary">
            {column.description}
          </Typography>
        )}

        {isAddingCard && (
          <AddCardInlineForm
            onSubmit={(title) => {
              if (title.trim()) onAddCard({ title: title.trim(), columnId: column.id });
              setIsAddingCard(false);
            }}
            onCancel={() => setIsAddingCard(false)}
          />
        )}
      </Box>
    </Box>
  );
}


function ColumnHeader({ column, cardCount, isHovered, isHoveredByDrag, onDragStart, onDragEnd, onAddClick }) {
  const borderColor = isHoveredByDrag ? column.color : "#D9D9D9";
  const borderWidth = isHoveredByDrag ? "2px" : "1px";
  const iconColor = isHovered ? "icon.main" : "transparent";

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "grab",
        userSelect: "none",
        padding: "12px 20px",
        borderBottom: `${borderWidth} solid ${borderColor}`,
      }}
    >
      <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <ColorSwatch size={10} value={column.color} />
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {column.title}
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight={500}>
          {cardCount}
        </Typography>
      </Box>
      <Box display="flex" gap={0.5}>
        <UiButtonIcon onClick={onAddClick} title="Create task" size="small">
          <AddOutlinedIcon fontSize="small" sx={{ color: iconColor }} />
        </UiButtonIcon>
        <UiButtonIcon title="More actions" size="small">
          <MoreHorizOutlinedIcon fontSize="small" sx={{ color: iconColor }} />
        </UiButtonIcon>
      </Box>
    </Box>
  );
}

function AddCardInlineForm({ onSubmit, onCancel }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(value);
    }
    if (e.key === "Escape") onCancel();
  };

  return (
    <ClickAwayListener onClickAway={onCancel}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          gap: 1,
          border: "2px solid #D9D9D9",
          borderRadius: "6px",
          padding: "4px 8px",
          "&:focus-within": { borderColor: "primary.main" },
        }}
      >
        <TextField
          autoFocus
          multiline
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task... (Press Enter to save)"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiInputBase-input": { fontSize: "14px", padding: "4px 0" },
          }}
        />
        <Tooltip title="Press Enter to save">
          <UiButtonIcon size="small" onClick={() => onSubmit(value)}>
            <KeyboardReturnIcon fontSize="small" />
          </UiButtonIcon>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
}