import { useState, useEffect } from "react";
import { Typography, Box, TextField, Tooltip, Menu, MenuItem } from "@mui/material";
import { ClickAwayListener } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { KanbanCard } from "./KanbanCard";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import { ColorSwatch } from "../../../components/Swatch/ColorSwatch";
import { Plus, Ellipsis } from "lucide-react";
import BaseIcon from "../../../components/Icon/BaseIcon";

export function KanbanColumn({
  column,
  cards,
  allColumns,
  isHoveredByDrag,
  dropTargetCardId,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onUpdateColumn,
  onDeleteColumn,
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
        borderRadius: "8px",
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
        onUpdateColumn={onUpdateColumn}
        onDeleteColumn={onDeleteColumn}
      />

      <Box sx={{ flex: 1, minHeight: 60, padding: "12px 1rem", gap: 1, display: "flex", flexDirection: "column" }}>
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

        {isAddingCard && (
          <AddCardInlineForm
            onSubmit={(title) => {
              if (title.trim()) onAddCard({ title: title.trim(), columnId: column.id });
              setIsAddingCard(false);
            }}
            onCancel={() => setIsAddingCard(false)}
          />
        )}

        <ColumnDescription
          columnId={column.id}
          description={column.description}
          onUpdateColumn={onUpdateColumn}
        />
      </Box>
    </Box>
  );
}


function ColumnHeader({ column, cardCount, isHovered, isHoveredByDrag, onDragStart, onDragEnd, onAddClick, onUpdateColumn, onDeleteColumn }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(column.title);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    setDraftTitle(column.title);
  }, [column.title]);

  const borderColor = isHoveredByDrag ? column.color : "#D9D9D9";
  const borderWidth = isHoveredByDrag ? "2px" : "1px";
  const iconColor = isHovered ? "default" : "transparent";
  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleDeleteColumn = () => {
    handleMenuClose();
    onDeleteColumn?.(column.id);
  };

  const handleStartEditing = (event) => {
    event.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleCancelEditing = () => {
    setDraftTitle(column.title);
    setIsEditingTitle(false);
  };

  const handleSaveTitle = () => {
    const normalized = draftTitle.trim();
    if (normalized && normalized !== column.title) {
      onUpdateColumn?.(column.id, { title: normalized });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSaveTitle();
    }
    if (event.key === "Escape") {
      handleCancelEditing();
    }
  };

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
      {isEditingTitle ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "100%" }}>
          <TextField
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleTitleKeyDown}
            variant="standard"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: 14, fontWeight: 500, padding: 0 } }}
            sx={{ minWidth: 120 }}
          />
          <UiButtonIcon title="Save" size="small" onClick={handleSaveTitle}>
            <CheckIcon fontSize="small" />
          </UiButtonIcon>
          <UiButtonIcon title="Cancel" size="small" onClick={handleCancelEditing}>
            <CloseIcon fontSize="small" />
          </UiButtonIcon>
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center", flex: 1, minWidth: 0 }}>
            <ColorSwatch size={10} value={column.color} />
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight={500}
              onDoubleClick={handleStartEditing}
              sx={{ cursor: "text", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {column.title}
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {cardCount}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5}>
            <UiButtonIcon onClick={onAddClick} title="Create task" size="small">
              <BaseIcon variant={iconColor}><Plus /></BaseIcon>
            </UiButtonIcon>
            <UiButtonIcon title="More actions" size="small" onClick={handleMenuOpen}>
              <BaseIcon variant={iconColor}><Ellipsis /></BaseIcon>
            </UiButtonIcon>
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <MenuItem
                onClick={(event) => {
                  handleMenuClose();
                  handleStartEditing(event);
                }}
                sx={{ fontSize: 14 }}
              >
                Update column
              </MenuItem>
              <MenuItem onClick={handleDeleteColumn} sx={{ fontSize: 14 }}>
                Delete column
              </MenuItem>
            </Menu>
          </Box>
        </>
      )}
    </Box>
  );
}

export function ColumnDescription({ columnId, description, onUpdateColumn }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDescription, setDraftDescription] = useState(description ?? "");

  useEffect(() => {
    setDraftDescription(description ?? "");
  }, [description]);

  const handleCancelDescription = () => {
    setDraftDescription(description ?? "");
    setIsEditing(false);
  };

  const handleSaveDescription = () => {
    const normalized = draftDescription.trim();
    const nextValue = normalized || null;

    if (nextValue !== (description ?? null)) {
      onUpdateColumn?.(columnId, { description: nextValue });
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSaveDescription();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelDescription();
    }
  };

  return (
    <Box
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "100%" }}>
          <TextField
            autoFocus
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            onBlur={handleSaveDescription}
            onKeyDown={handleKeyDown}
            variant="standard"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: 14, fontWeight: 500, padding: 0 } }}
            sx={{ minWidth: 120 }}
          />
          <UiButtonIcon title="Save" size="small" onClick={handleSaveDescription}>
            <CheckIcon fontSize="small" />
          </UiButtonIcon>
          <UiButtonIcon title="Cancel" size="small" onClick={handleCancelDescription}>
            <CloseIcon fontSize="small" />
          </UiButtonIcon>
        </Box>
      ) : (
        <Typography variant="body2" color="text.primary">
          {description || "Add a description... (Double click to edit)"}
        </Typography>
      )}
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
          borderRadius: "8px",
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