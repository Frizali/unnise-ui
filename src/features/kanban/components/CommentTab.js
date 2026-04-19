import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MessagingSvg from "../../../assets/Messaging-bro.svg";
import * as signalR from "@microsoft/signalr";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";

const EMOJI_LIST = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🎉",
  "🔥",
  "✅",
  "⚠️",
  "💡",
  "🚀",
  "👏",
  "🙏",
  "💯",
  "🤔",
  "😅",
  "👀",
  "✨",
  "💪",
  "🎯",
];

function EmojiPicker({ onSelect, onClose }) {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        right: 0,
        background: "#fff",
        border: "1px solid #D9D9D9",
        borderRadius: "4px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        padding: "8px",
        display: "flex",
        flexWrap: "wrap",
        width: 220,
        gap: "2px",
        zIndex: 10,
      }}
    >
      {EMOJI_LIST.map((e) => (
        <Box
          key={e}
          onClick={() => {
            onSelect(e);
            onClose();
          }}
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: 18,
            "&:hover": { background: "#F3F4F6" },
          }}
        >
          {e}
        </Box>
      ))}
    </Box>
  );
}

function FilePreview({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {files.map((f, i) => {
        const isImg = f.type.startsWith("image/");
        const url = URL.createObjectURL(f);
        return (
          <Box
            key={i}
            sx={{
              position: "relative",
              border: "1px solid #D9D9D9",
              borderRadius: "8px",
              overflow: "hidden",
              width: isImg ? 80 : "auto",
              height: isImg ? 80 : "auto",
              minWidth: isImg ? 80 : 120,
              display: "flex",
              alignItems: "center",
              flexDirection: isImg ? "column" : "row",
              padding: isImg ? 0 : "6px 10px",
              gap: isImg ? 0 : 1,
              background: "#F9FAFB",
            }}
          >
            {isImg ? (
              <img
                src={url}
                alt={f.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <>
                <InsertDriveFileOutlinedIcon
                  sx={{ fontSize: 18, color: "#6B7280" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: 80 }}
                >
                  {f.name}
                </Typography>
              </>
            )}
            <Box
              onClick={() => onRemove(i)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CloseOutlinedIcon sx={{ fontSize: 11, color: "#fff" }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function AttachmentDisplay({ attachments }) {
  if (!attachments?.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {attachments.map((a, i) => {
        const isImg = a.contentType?.startsWith("image/");
        return isImg ? (
          <Box
            key={i}
            component="a"
            href={a.url}
            target="_blank"
            sx={{
              display: "block",
              width: 200,
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #D9D9D9",
              flexShrink: 0,
            }}
          >
            <img
              src={a.url}
              alt={a.fileName}
              style={{ width: "100%", display: "block" }}
            />
          </Box>
        ) : (
          <Chip
            key={i}
            icon={<InsertDriveFileOutlinedIcon />}
            label={a.fileName}
            component="a"
            href={a.url}
            target="_blank"
            clickable
            size="small"
            sx={{ background: "#F3F4F6" }}
          />
        );
      })}
    </Box>
  );
}

function CommentComposer({
  onSubmit,
  replyTo,
  onCancelReply,
  placeholder = "Write a comment...",
  autoFocus = false,
  initialText = "",
  isEditMode = false,
  onCancelEdit,
}) {
  const [text, setText] = useState(initialText);
  const [files, setFiles] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const textFieldRef = useRef(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if ((autoFocus || isEditMode) && textFieldRef.current) {
      textFieldRef.current.focus();
      const len = textFieldRef.current.value.length;
      textFieldRef.current.setSelectionRange(len, len);
    }
  }, [autoFocus, isEditMode]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    textFieldRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!text.trim() && !files.length) return;
    setSubmitting(true);
    try {
      await onSubmit({
        content: text.trim(),
        files,
        replyToId: replyTo?.id || null,
      });
      setText("");
      setFiles([]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      if (isEditMode && onCancelEdit) onCancelEdit();
      if (onCancelReply) onCancelReply();
    }
  };

  const isEmpty = !text.trim() && !files.length;

  return (
    <Box
      sx={{
        border: "1px solid #D9D9D9",
        borderRadius: "4px",
        overflow: "visible",
        background: "#fff",
        transition: "border-color 0.15s, box-shadow 0.15s",
        "&:focus-within": {
          borderColor: isEditMode ? "#D97706" : "#315cfd",
          //   boxShadow: isEditMode
          //     ? "0 0 0 3px rgba(217,119,6,0.08)"
          //     : "0 0 0 3px rgba(99,102,241,0.08)",
        },
      }}
    >
      {(replyTo || isEditMode) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderBottom: "1px solid #D9D9D9",
            background: isEditMode ? "#FFFBEB" : "#F9FAFB",
            borderRadius: "10px 10px 0 0",
          }}
        >
          {isEditMode ? (
            <EditOutlinedIcon sx={{ fontSize: 14, color: "#D97706" }} />
          ) : (
            <ReplyOutlinedIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
          )}
          <Typography variant="caption" color="text.secondary">
            {isEditMode ? (
              <span>Editing comment</span>
            ) : (
              <span>
                Replying to <strong>{replyTo?.author?.username}</strong>
              </span>
            )}
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              size="small"
              onClick={isEditMode ? onCancelEdit : onCancelReply}
              sx={{ p: 0 }}
            >
              <CloseOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      <Box sx={{ px: 1.5, pt: 1 }}>
        <TextField
          inputRef={textFieldRef}
          multiline
          minRows={replyTo || isEditMode ? 1 : 2}
          maxRows={6}
          fullWidth
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            "& .MuiInputBase-input": { fontSize: 14, color: "text.primary" },
            "& textarea::placeholder": { color: "text.primary" },
          }}
        />
        <FilePreview files={files} onRemove={handleRemoveFile} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.75,
          gap: 0.25,
          borderTop: "1px solid #D9D9D9",
          mt: 0.5,
        }}
      >
        {!isEditMode && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <UiButtonIcon
              title="Attach File"
              onClick={() => fileInputRef.current?.click()}
            >
              <AttachFileOutlinedIcon fontSize="small" />
            </UiButtonIcon>
          </>
        )}
        <Box sx={{ position: "relative" }}>
          <UiButtonIcon title="Emoji" onClick={() => setShowEmoji((v) => !v)}>
            <EmojiEmotionsOutlinedIcon fontSize="small" />
          </UiButtonIcon>

          {showEmoji && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </Box>

        {isEditMode && (
          <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
            Esc to cancel
          </Typography>
        )}

        <Box sx={{ ml: "auto" }}>
          <Tooltip
            title={
              isEmpty
                ? "Type something first"
                : isEditMode
                  ? "Save (Enter)"
                  : "Send (Enter)"
            }
          >
            <span>
              <Button
                size="small"
                disabled={isEmpty || submitting}
                onClick={handleSubmit}
                loading={submitting}
                sx={{
                  background: isEmpty
                    ? "transparent"
                    : isEditMode
                      ? "#D97706"
                      : "#315cfd",
                  color: isEmpty ? "#D1D5DB" : "#fff",
                  minWidth: "2rem",
                  height: "2rem",
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                  "&:hover": {
                    background: isEmpty
                      ? ""
                      : isEditMode
                        ? "#B45309"
                        : "#315cfd",
                  },
                  transition: "all 0.15s",
                }}
              >
                {isEditMode ? (
                  <EditOutlinedIcon fontSize="small" />
                ) : (
                  <SendOutlinedIcon fontSize="small" />
                )}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

function CommentMenu({ comment, currentUserId, onEdit, onDelete }) {
  const [anchor, setAnchor] = useState(null);
  const isOwner = comment.author?.id === currentUserId;
  if (!isOwner) return null;

  return (
    <>
      <Tooltip title="More">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchor(e.currentTarget);
          }}
          sx={{
            ml: "auto",
            p: 0.25,
            color: "#9CA3AF",
            opacity: 0,
            ".comment-item:hover &": { opacity: 1 },
            "&:hover": { color: "#374151" },
          }}
        >
          <MoreHorizOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: "4px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            minWidth: 140,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onEdit();
          }}
          sx={{ gap: 1, fontSize: 13, py: 0.75 }}
        >
          <ListItemIcon sx={{ minWidth: 0 }}>
            <EditOutlinedIcon sx={{ fontSize: 16, color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 13 }}>
            Edit
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onDelete();
          }}
          sx={{ gap: 1, fontSize: 13, py: 0.75, color: "#DC2626" }}
        >
          <ListItemIcon sx={{ minWidth: 0 }}>
            <DeleteOutlineOutlinedIcon
              sx={{ fontSize: 16, color: "#DC2626" }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: 13, color: "#DC2626" }}
          >
            Delete
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onPin,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  isReply = false,
}) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const isLiked = comment.likes?.some((l) => l.userId === currentUserId);
  const isPinned = comment.isPinned;

  const handleReplySubmit = async (payload) => {
    await onReply({ ...payload, replyToId: comment.id });
    setShowReply(false);
  };

  const handleEditSubmit = async ({ content }) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => onDelete(comment.id);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <Box
      className="comment-item"
      sx={{ display: "flex", gap: 1.5, mb: depth === 0 ? 0 : 0 }}
    >
      <Avatar
        src={comment.author?.avatar}
        sx={{
          width: depth === 0 ? 32 : 26,
          height: depth === 0 ? 32 : 26,
          flexShrink: 0,
          mt: 0.25,
          fontSize: depth === 0 ? 14 : 12,
        }}
      >
        {comment.author?.username?.[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <CommentComposer
            isEditMode
            initialText={comment.content}
            onSubmit={handleEditSubmit}
            onCancelEdit={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <Box
            sx={{
              background: "#F9FAFB",
              border: `1px solid ${isPinned ? "#FDE68A" : "#D9D9D9"}`,
              borderRadius: "4px",
              padding: "10px 14px",
              position: "relative",
              ...(isPinned && { background: "#FFFBEB" }),
            }}
          >
            {isPinned && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <PushPinIcon
                  sx={{
                    fontSize: 11,
                    color: "#D97706",
                    transform: "rotate(45deg)",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#D97706", fontWeight: 600, fontSize: 10 }}
                >
                  PINNED
                </Typography>
              </Box>
            )}

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                {comment.author?.username}
              </Typography>
              <Typography variant="caption" color="text.disabled" fontSize={12}>
                {timeAgo(comment.createdAt)}
              </Typography>
              {comment.isEdited && (
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontSize={11}
                >
                  (edited)
                </Typography>
              )}
              {/* 3-dot menu — only owner sees it */}
              <CommentMenu
                comment={comment}
                currentUserId={currentUserId}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDelete}
              />
            </Box>

            {comment.content && (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {comment.content}
              </Typography>
            )}
            <AttachmentDisplay attachments={comment.attachments} />
          </Box>
        )}

        {/* Actions */}
        {!isEditing && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 0.5,
              ml: 0.5,
            }}
          >
            <Box
              onClick={() => onLike(comment.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                padding: "2px 8px",
                borderRadius: "4px",
                "&:hover": { background: "#F3F4F6" },
                color: isLiked ? "#315cfd" : "#6B7280",
              }}
            >
              {isLiked ? (
                <ThumbUpIcon fontSize="small" />
              ) : (
                <ThumbUpOutlinedIcon fontSize="small" />
              )}
              <Typography
                variant="caption"
                fontSize={14}
                // fontWeight={isLiked ? 600 : 400}
              >
                {comment.likes?.length > 0 ? comment.likes.length : ""} Like
              </Typography>
            </Box>

            {!isReply && (
              <Box
                onClick={() => setShowReply((v) => !v)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  "&:hover": { background: "#F3F4F6" },
                  color: "#6B7280",
                }}
              >
                <ReplyOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  Reply
                </Typography>
              </Box>
            )}

            {!isReply && (
              <Box
                onClick={() => onPin(comment.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  "&:hover": { background: "#F3F4F6" },
                  color: isPinned ? "#D97706" : "#6B7280",
                }}
              >
                {isPinned ? (
                  <PushPinIcon
                    sx={{ fontSize: 13, transform: "rotate(45deg)" }}
                  />
                ) : (
                  <PushPinOutlinedIcon sx={{ fontSize: 13 }} />
                )}
                <Typography variant="caption" fontSize={12}>
                  Pin
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Reply Composer */}
        <Collapse in={showReply && !isEditing}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <CommentComposer
              onSubmit={handleReplySubmit}
              placeholder={`Reply to ${comment.author?.username}...`}
              autoFocus
            />
          </Box>
        </Collapse>

        {comment.replies?.length > 0 && (
          <Box>
            <Box
              onClick={() => setShowReplies((v) => !v)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                mb: 1,
                mt: 0.5,
                // ml: 0.5,
              }}
            >
              {/* <Box sx={{ height: "1px", width: 20, background: "#D1D5DB" }} /> */}
              <Typography variant="body2" color="primary" fontSize={14}>
                {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </Typography>
            </Box>
            <Collapse in={showReplies}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  pl: 0.5,
                  borderLeft: "1px solid #D9D9D9",
                  ml: 1,
                }}
              >
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onLike={onLike}
                    onPin={onPin}
                    onReply={(payload) =>
                      onReply({ ...payload, replyToId: reply.id })
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                    depth={depth + 1}
                    isReply={true}
                  />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function useCommentHub({
  cardId,
  onReceive,
  onUpdate,
  onDelete,
  onLiked,
  onPinned,
}) {
  const hubRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!cardId) return;

    const hub = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5157/hubs/comments", {
        accessTokenFactory: () => localStorage.getItem("accessToken") || "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    hubRef.current = hub;

    hub.on("ReceiveComment", onReceive);
    hub.on("CommentUpdated", onUpdate);
    hub.on("CommentDeleted", onDelete);
    hub.on("CommentLiked", onLiked);
    hub.on("CommentPinned", onPinned);

    hub
      .start()
      .then(() => {
        setConnected(true);
        hub.invoke("JoinCardRoom", cardId);
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      hub.invoke("LeaveCardRoom", cardId).catch(() => {});
      hub.stop();
      setConnected(false);
    };
  }, [cardId]);

  const sendComment = useCallback(async (payload) => {
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("SendComment", payload);
    }
  }, []);

  const editComment = useCallback(async (commentId, content) => {
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("EditComment", { commentId, content });
    }
  }, []);

  const deleteComment = useCallback(async (commentId) => {
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("DeleteComment", { commentId });
    }
  }, []);

  const toggleLike = useCallback(async (commentId) => {
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("ToggleLike", { commentId });
    }
  }, []);

  const togglePin = useCallback(async (commentId) => {
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("TogglePin", { commentId });
    }
  }, []);

  return {
    connected,
    sendComment,
    editComment,
    deleteComment,
    toggleLike,
    togglePin,
  };
}

export function CommentTab({
  cardId,
  currentUser,
  initialComments = [],
  onUploadFiles,
}) {
  const [comments, setComments] = useState(initialComments);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleReceive = useCallback((comment) => {
    setComments((prev) => {
      if (comment.replyToId) {
        return prev.map((c) =>
          c.id === comment.replyToId
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c,
        );
      }
      return [...prev, comment];
    });
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, []);

  const handleUpdate = useCallback((updated) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === updated.id) return { ...c, ...updated };
        if (c.replies?.length) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === updated.id ? { ...r, ...updated } : r,
            ),
          };
        }
        return c;
      }),
    );
  }, []);

  const handleDelete = useCallback((commentId) => {
    setComments((prev) =>
      prev
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r.id !== commentId) ?? [],
        })),
    );
  }, []);

  const handleLiked = useCallback((commentId, likes) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) return { ...c, likes };
        if (c.replies?.length) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, likes } : r,
            ),
          };
        }
        return c;
      }),
    );
  }, []);

  const handlePinned = useCallback((commentId, isPinned) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isPinned } : c)),
    );
  }, []);

  const {
    connected,
    sendComment,
    editComment,
    deleteComment,
    toggleLike,
    togglePin,
  } = useCommentHub({
    cardId,
    onReceive: handleReceive,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onLiked: handleLiked,
    onPinned: handlePinned,
  });

  const handleSubmit = async ({ content, files, replyToId }) => {
    let attachmentUrls = [];
    if (files?.length && onUploadFiles) {
      attachmentUrls = await onUploadFiles(files);
    }
    await sendComment({ cardId, content, replyToId, attachmentUrls });
  };

  const handleReply = async (payload) => {
    await sendComment({ cardId, ...payload });
    setReplyTo(null);
  };

  const handleEdit = async (commentId, content) => {
    await editComment(commentId, content);
  };

  const handleDeleteAsync = async (commentId) => {
    await deleteComment(commentId);
  };

  const pinned = comments.filter((c) => c.isPinned && !c.replyToId);
  const regular = comments.filter((c) => !c.isPinned && !c.replyToId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* {!connected && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            background: "#FEF3C7",
            borderBottom: "1px solid #FDE68A",
          }}
        >
          <CircularProgress size={10} sx={{ color: "#D97706" }} />
          <Typography variant="caption" color="#92400E">
            Connecting to live comments...
          </Typography>
        </Box>
      )} */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pr: "4px",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            background: "#E5E7EB",
            borderRadius: 4,
          },
        }}
      >
        {comments.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <img src={MessagingSvg} alt="messaging" width={250} />
            <Typography variant="body2" color="text.primary">
              No comments yet. Start the conversation!
            </Typography>
          </Box>
        )}

        {pinned.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUser?.id ?? currentUser}
            onLike={toggleLike}
            onPin={togglePin}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDeleteAsync}
          />
        ))}

        {regular.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUser?.id ?? currentUser}
            onLike={toggleLike}
            onPin={togglePin}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDeleteAsync}
          />
        ))}

        <div ref={bottomRef} />
      </Box>
      <Box sx={{ pt: 1.5, borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
        <CommentComposer
          onSubmit={handleSubmit}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </Box>
    </Box>
  );
}
