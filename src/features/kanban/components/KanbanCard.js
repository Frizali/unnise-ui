import { useState } from "react";
import { Box, Typography, Divider, Avatar, AvatarGroup } from "@mui/material";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import { useSearchParams } from "react-router-dom";
import { KanbanBoardDetail } from "./KanbanCardDetail";

const PRIORITY_META = {
  High: { label: "High", color: "#dc2626", points: 18 },
  Medium: { label: "Medium", color: "#d97706", points: 12 },
  Low: { label: "Low", color: "#16a34a", points: 6 },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [dragging, setDragging] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const p = PRIORITY_META[card.priority];

  const handleCardClick = (cardId) => {
    const params = new URLSearchParams(searchParams);
    params.set("card", cardId);
    setSearchParams(params);
    setShowDetail(true);
  };

  return (
    <>
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
        onClick={() => handleCardClick(card.id)}
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
        <Box
          sx={{
            borderLeft: `2px solid ${p.color}`,
            padding: "0 12px 0 10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            {p.label}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {p.points} Points
          </Typography>
        </Box>

        <Box sx={{ padding: ".5rem 12px" }}>
          <Box mb={1}>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {card.title}
            </Typography>
            {card.description && (
              <Typography
                fontSize={14}
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            {card.endDate && (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <OutlinedFlagRoundedIcon
                  fontSize="small"
                  sx={{ color: "icon.main" }}
                />
                <Typography fontSize={14} color="text.primary">
                  31 March 2026
                </Typography>
              </Box>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AvatarGroup spacing="small">
              <Avatar sx={{ width: 24, height: 24 }} />
              <Avatar sx={{ width: 24, height: 24 }} />
              <Avatar sx={{ width: 24, height: 24 }} />
            </AvatarGroup>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <UiButtonIconText
                title="Comments"
                icon={<ChatOutlinedIcon fontSize="small" />}
              >
                13
              </UiButtonIconText>
              <UiButtonIconText
                title="Attachments"
                icon={<AttachFileOutlinedIcon fontSize="small" />}
              >
                4
              </UiButtonIconText>
            </Box>
          </Box>
        </Box>
      </Box>
      <KanbanBoardDetail showDetail={showDetail} setShowDetail={setShowDetail} columns={columns}/>
    </>
  );
}
