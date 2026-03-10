import { useState } from "react";
import { Box, Typography, Divider, Avatar, AvatarGroup } from "@mui/material";

const PRIORITY_META = {
  high: { label: "High", color: "#dc2626" },
  medium: { label: "Medium", color: "#d97706" },
  low: { label: "Low", color: "#16a34a" },
};

export function KanbanCard({
  card,
  onDelete,
  onMoveCard,
  column,
  columns,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [dragging, setDragging] = useState(false);
  const p = PRIORITY_META[card.priority];

  return (
    <Box
      draggable
      onDragStart={(e) => {
        onDragStart(e, card.id);
        setDragging(true);
      }}
      onDragEnd={(e) => {
        onDragEnd(e);
        setDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver(card.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(card.id);
      }}
      sx={{
        backgroundColor: "white",
        border: `1px solid #D9D9D9`,
        borderRadius: "4px",
        padding: "12px 0",
        marginBottom: 1,
        cursor: "pointer",
        userSelect: "none",
        transform: isDropTarget ? "translateY(-3px)" : "none",
        transition: dragging ? "none" : "all 0.15s",
        position: "relative",
      }}
    >
      {isDropTarget && (
        <Box
          style={{
            position: "absolute",
            top: -4,
            left: 10,
            right: 10,
            height: 2,
            borderRadius: 2,
            background: `${column.color}`,
          }}
        />
      )}
      <Box sx={{ borderLeft: `2px solid ${p.color}`, padding: "0 12px" }}>
        <Typography fontSize={12} color="text.primary">
          {p.label}
        </Typography>
      </Box>

      <Box sx={{ padding: ".5rem 12px" }}>
        <Typography variant="body2" color="text.primary">
          {card.title}
        </Typography>
        {card.desc && (
          <Typography fontSize={12} color="text.secondary">
            {card.desc}
          </Typography>
        )}
        <Divider sx={{ my: 1 }} />
        <AvatarGroup spacing="small">
          <Avatar sx={{ width: 24, height: 24 }}/>
          <Avatar sx={{ width: 24, height: 24 }}/>
          <Avatar sx={{ width: 24, height: 24 }}/>
        </AvatarGroup>
      </Box>
    </Box>
  );
}
