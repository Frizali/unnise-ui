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
import * as signalR from "@microsoft/signalr";

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
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
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
            borderRadius: "6px",
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
              border: "1px solid #E5E7EB",
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
              border: "1px solid #E5E7EB",
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
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const textFieldRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [autoFocus]);

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
  };

  const isEmpty = !text.trim() && !files.length;

  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        overflow: "visible",
        background: "#fff",
        transition: "border-color 0.15s, box-shadow 0.15s",
        "&:focus-within": {
          borderColor: "#6366F1",
          boxShadow: "0 0 0 3px rgba(99,102,241,0.08)",
        },
      }}
    >
      {replyTo && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderBottom: "1px solid #F3F4F6",
            background: "#F9FAFB",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <ReplyOutlinedIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
          <Typography variant="caption" color="text.secondary">
            Replying to <strong>{replyTo.author?.username}</strong>
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <IconButton size="small" onClick={onCancelReply} sx={{ p: 0 }}>
              <CloseOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
      )}
      <Box sx={{ px: 1.5, pt: 1 }}>
        <TextField
          inputRef={textFieldRef}
          multiline
          minRows={replyTo ? 1 : 2}
          maxRows={6}
          fullWidth
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            "& .MuiInputBase-input": { fontSize: 14, color: "#111827" },
            "& textarea::placeholder": { color: "#9CA3AF" },
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
          borderTop: "1px solid #F3F4F6",
          mt: 0.5,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Tooltip title="Attach file">
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{ color: "#9CA3AF", "&:hover": { color: "#6366F1" } }}
          >
            <AttachFileOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="GIF">
          <IconButton
            size="small"
            sx={{ color: "#9CA3AF", "&:hover": { color: "#6366F1" } }}
          >
            <GifBoxOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Emoji">
            <IconButton
              size="small"
              onClick={() => setShowEmoji((v) => !v)}
              sx={{
                color: showEmoji ? "#6366F1" : "#9CA3AF",
                "&:hover": { color: "#6366F1" },
              }}
            >
              <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          {showEmoji && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Tooltip title={isEmpty ? "Type something first" : "Send (Enter)"}>
            <span>
              <IconButton
                size="small"
                disabled={isEmpty || submitting}
                onClick={handleSubmit}
                sx={{
                  background: isEmpty ? "#F3F4F6" : "#6366F1",
                  color: isEmpty ? "#D1D5DB" : "#fff",
                  borderRadius: "8px",
                  width: 30,
                  height: 30,
                  "&:hover": { background: isEmpty ? "#F3F4F6" : "#4F46E5" },
                  transition: "all 0.15s",
                }}
              >
                {submitting ? (
                  <CircularProgress size={14} sx={{ color: "#fff" }} />
                ) : (
                  <SendOutlinedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onPin,
  onReply,
  depth = 0,
}) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const isLiked = comment.likes?.some((l) => l.userId === currentUserId);
  const isPinned = comment.isPinned;

  const handleReplySubmit = async (payload) => {
    await onReply(payload);
    setShowReply(false);
  };

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
    <Box sx={{ display: "flex", gap: 1.5, mb: depth === 0 ? 0 : 0 }}>
      <Avatar
        src={comment.author?.avatar}
        sx={{
          width: depth === 0 ? 32 : 26,
          height: depth === 0 ? 32 : 26,
          flexShrink: 0,
          mt: 0.25,
          fontSize: depth === 0 ? 13 : 11,
        }}
      >
        {comment.author?.username?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            background: "#F9FAFB",
            border: `1px solid ${isPinned ? "#FDE68A" : "#F3F4F6"}`,
            borderRadius: "10px",
            padding: "10px 14px",
            position: "relative",
            ...(isPinned && { background: "#FFFBEB" }),
          }}
        >
          {isPinned && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              fontSize={13}
            >
              {comment.author?.username}
            </Typography>
            <Typography variant="caption" color="text.disabled" fontSize={11}>
              {timeAgo(comment.createdAt)}
            </Typography>
          </Box>
          {comment.content && (
            <Typography
              variant="body2"
              color="text.primary"
              fontSize={13}
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

        {/* Actions */}
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
              borderRadius: "6px",
              "&:hover": { background: "#F3F4F6" },
              color: isLiked ? "#6366F1" : "#6B7280",
            }}
          >
            {isLiked ? (
              <ThumbUpIcon sx={{ fontSize: 13 }} />
            ) : (
              <ThumbUpOutlinedIcon sx={{ fontSize: 13 }} />
            )}
            <Typography
              variant="caption"
              fontSize={12}
              fontWeight={isLiked ? 600 : 400}
            >
              {comment.likes?.length > 0 ? comment.likes.length : ""} Like
            </Typography>
          </Box>
          <Box
            onClick={() => {
              setShowReply((v) => !v);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              padding: "2px 8px",
              borderRadius: "6px",
              "&:hover": { background: "#F3F4F6" },
              color: "#6B7280",
            }}
          >
            <ReplyOutlinedIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption" fontSize={12}>
              Reply
            </Typography>
          </Box>
          <Box
            onClick={() => onPin(comment.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              padding: "2px 8px",
              borderRadius: "6px",
              "&:hover": { background: "#F3F4F6" },
              color: isPinned ? "#D97706" : "#6B7280",
            }}
          >
            {isPinned ? (
              <PushPinIcon sx={{ fontSize: 13, transform: "rotate(45deg)" }} />
            ) : (
              <PushPinOutlinedIcon sx={{ fontSize: 13 }} />
            )}
            <Typography variant="caption" fontSize={12}>
              Pin
            </Typography>
          </Box>
        </Box>

        {/* Reply Composer */}
        <Collapse in={showReply}>
          <Box sx={{ mt: 1, mb: 1 }}>
            <CommentComposer
              onSubmit={handleReplySubmit}
              placeholder={`Reply to ${comment.author?.username}...`}
              autoFocus
            />
          </Box>
        </Collapse>

        {/* Nested Replies */}
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
                ml: 0.5,
              }}
            >
              <Box sx={{ height: "1px", width: 20, background: "#D1D5DB" }} />
              <Typography
                variant="caption"
                color="primary"
                fontSize={12}
                fontWeight={600}
              >
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
                  borderLeft: "2px solid #E5E7EB",
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
                    depth={depth + 1}
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
    // payload: { cardId, content, replyToId, attachmentUrls }
    if (hubRef.current?.state === signalR.HubConnectionState.Connected) {
      await hubRef.current.invoke("SendComment", payload);
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

  return { connected, sendComment, toggleLike, togglePin };
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
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
    );
  }, []);

  const handleDelete = useCallback((commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  const handleLiked = useCallback((commentId, likes) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes } : c)),
    );
  }, []);

  const handlePinned = useCallback((commentId, isPinned) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isPinned } : c)),
    );
  }, []);

  const { connected, sendComment, toggleLike, togglePin } = useCommentHub({
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
      {!connected && (
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
      )}

      {/* Comment list */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            background: "#E5E7EB",
            borderRadius: 4,
          },
        }}
      >
        {comments.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.disabled">
              No comments yet. Start the conversation!
            </Typography>
          </Box>
        )}

        {/* Pinned */}
        {pinned.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUser?.id}
            onLike={toggleLike}
            onPin={togglePin}
            onReply={handleReply}
          />
        ))}

        {/* Regular */}
        {regular.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUserId={currentUser?.id}
            onLike={toggleLike}
            onPin={togglePin}
            onReply={handleReply}
          />
        ))}

        <div ref={bottomRef} />
      </Box>

      {/* Composer */}
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
