import { useState } from "react";
import { Box, Typography, Divider, Avatar, AvatarGroup } from "@mui/material";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const PRIORITY_META = {
  High: { label: "High", color: "#dc2626" },
  Medium: { label: "Medium", color: "#d97706" },
  Low: { label: "Low", color: "#16a34a" },
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

  console.log(card);

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
        padding: "12px 0 4px 0",
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
        <Box>
          <Typography variant="body2" color="text.primary">
            {card.title}
          </Typography>
          {card.description && (
            <Typography
              fontSize={14}
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.description}
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <AvatarGroup spacing="small">
            <Avatar sx={{ width: 24, height: 24 }} />
            <Avatar sx={{ width: 24, height: 24 }} />
            <Avatar sx={{ width: 24, height: 24 }} />
          </AvatarGroup>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap:.5
          }}>
            <UiButtonIconText title="Comments" icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}>
              13
            </UiButtonIconText>
            <UiButtonIconText title="Attachments" icon={<AttachFileOutlinedIcon fontSize="small" />}>
              4
            </UiButtonIconText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
