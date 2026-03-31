import { useState } from "react";
import { Box, Typography, Divider, Avatar, AvatarGroup } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import LabelGroup from "../../../components/Label/LabelGroup";
import { KanbanBoardDetail } from "./KanbanCardDetail";

const PRIORITY_META = {
  High: { label: "High", color: "#dc2626", points: 18 },
  Medium: { label: "Medium", color: "#d97706", points: 12 },
  Low: { label: "Low", color: "#16a34a", points: 6 },
};

export function KanbanCard({
  card,
  column,
  columns,
  isDropTarget,
  onUpdate,
  onDelete,
  onMoveCard,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDragging, setIsDragging] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const priority = PRIORITY_META[card.priority];

  const openDetail = () => {
    const params = new URLSearchParams(searchParams);
    params.set("card", card.id);
    setSearchParams(params);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Box
        draggable
        onDragStart={(e) => {
          onDragStart(e, card.id);
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          onDragEnd(e);
          setIsDragging(false);
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
        onClick={openDetail}
        sx={{
          backgroundColor: "white",
          border: "1px solid #D9D9D9",
          borderRadius: "4px",
          padding: "12px 0 4px 0",
          marginBottom: 1,
          cursor: "pointer",
          userSelect: "none",
          transform: isDropTarget ? "translateY(-3px)" : "none",
          transition: isDragging ? "none" : "all 0.15s",
          position: "relative",
        }}
      >
        {isDropTarget && <DropIndicator color={column.color} />}

        <CardPriorityBar priority={priority} />

        <Box sx={{ padding: ".5rem 12px" }}>
          <CardBody card={card} />
          <CardFooter card={card} />
        </Box>
      </Box>

      <KanbanBoardDetail
        card={card}
        onUpdate={onUpdate}
        showDetail={isDetailOpen}
        setShowDetail={setIsDetailOpen}
        columns={columns}
      />
    </>
  );
}

function DropIndicator({ color }) {
  return (
    <Box
      style={{
        position: "absolute",
        top: -4,
        left: 10,
        right: 10,
        height: 2,
        borderRadius: 2,
        background: color,
      }}
    />
  );
}

function CardPriorityBar({ priority }) {
  return (
    <Box
      sx={{
        borderLeft: `2px solid ${priority.color}`,
        padding: "0 12px 0 10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography fontSize={12} color="text.secondary">
        {priority.label}
      </Typography>
      <Typography fontSize={12} color="text.secondary">
        {priority.points} Points
      </Typography>
    </Box>
  );
}

function CardBody({ card }) {
  return (
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
      {card.labels?.length > 0 && (
        <Box mt={1}>
          <LabelGroup labels={card.labels} />
        </Box>
      )}
    </Box>
  );
}

function CardFooter({ card }) {
  return (
    <>
      {/* {card.endDate && (
        <Box sx={{ display: "flex", justifyContent: "end", mb: 0.5 }}>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <HourglassEmptyOutlinedIcon
              fontSize="small"
              sx={{ color: "icon.main" }}
            />
            <Typography fontSize={14} color="text.primary">
              {new Date(card.endDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      )} */}

      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CardAssignees assignees={card.assignees} />
        {card.endDate && (
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            {/* <CalendarTodayOutlinedIcon
              fontSize="small"
              sx={{ color: "icon.main" }}
            /> */}
            <Typography fontSize={14} color="text.primary">
              {new Date(card.endDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>
        )}
        {/* <Box sx={{ display: "flex", gap: 0.5 }}>
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
        </Box> */}
      </Box>
    </>
  );
}

function CardAssignees({ assignees = [] }) {
  if (assignees.length === 0) return null;

  if (assignees.length === 1) {
    const user = assignees[0];
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: ".25rem" }}>
        <Avatar sx={{ width: 26, height: 26 }}>
          <Typography fontSize={12} color="white">
            {user.username?.[0]?.toUpperCase()}
          </Typography>
        </Avatar>
        <Typography fontSize={14} color="text.primary">
          {user.username}
        </Typography>
      </Box>
    );
  }

  return (
    <AvatarGroup spacing="medium">
      {assignees.map((user, index) => (
        <Avatar key={user.id ?? index} sx={{ width: 26, height: 26 }}>
          <Typography fontSize={12} color="white">
            {user.username?.[0]?.toUpperCase()}
          </Typography>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
