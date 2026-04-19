import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  Alert,
  Collapse,
} from "@mui/material";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useState, useMemo } from "react";

const DIFFICULTY_OPTIONS = [
  {
    key: "Low",
    label: "Low",
    points: 3,
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#86efac",
    emoji: "🟢",
  },
  {
    key: "Medium",
    label: "Medium",
    points: 6,
    color: "#d97706",
    bg: "#fef3c7",
    border: "#fcd34d",
    emoji: "🟡",
  },
  {
    key: "High",
    label: "High",
    points: 10,
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#fca5a5",
    emoji: "🔴",
  },
];

export function DifficultyVote({
  members = [],
  card,
  onUpdateDifficulty,
  currentUserId,
}) {
  const [votes, setVotes] = useState([]);
  const [revealed, setRevealed] = useState(false);

  const getMemberVote = (memberId) =>
    votes.find((v) => v.cardId === card.id && v.memberId === memberId)
      ?.difficultyId ?? null;

  const currentUserVote = getMemberVote(currentUserId);

  const allVoted =
    members.length > 0 && members.every((m) => getMemberVote(m.id) !== null);
  const votedCount = members.filter((m) => getMemberVote(m.id) !== null).length;
  const pendingMembers = members.filter((m) => getMemberVote(m.id) === null);

  const tally = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    votes
      .filter((v) => v.cardId === card.id)
      .forEach((v) => {
        if (counts[v.difficultyId] !== undefined) counts[v.difficultyId]++;
      });
    return counts;
  }, [votes, card.id]);

  const winner = useMemo(() => {
    if (!allVoted) return null;
    return Object.entries(tally).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }, [allVoted, tally]);

  const handleVote = (diffKey) => {
    const newVotes = [
      ...votes.filter(
        (v) => !(v.cardId === card.id && v.memberId === currentUserId),
      ),
      { cardId: card.id, memberId: currentUserId, difficultyId: diffKey },
    ];
    setVotes(newVotes);

    const nowAllVoted = members.every(
      (m) =>
        newVotes.find((v) => v.cardId === card.id && v.memberId === m.id) !==
        undefined,
    );
    if (nowAllVoted) {
      const counts = { Low: 0, Medium: 0, High: 0 };
      newVotes
        .filter((v) => v.cardId === card.id)
        .forEach((v) => {
          if (counts[v.difficultyId] !== undefined) counts[v.difficultyId]++;
        });
      const winnerKey = Object.entries(counts).reduce((a, b) =>
        b[1] > a[1] ? b : a,
      )[0];
      setRevealed(true);
      onUpdateDifficulty?.(winnerKey);
    }
  };

  const getDiffOption = (key) => DIFFICULTY_OPTIONS.find((d) => d.key === key);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Collapse in={!allVoted && votedCount > 0}>
        <Alert
          severity="warning"
          icon={<WarningAmberOutlinedIcon fontSize="small" />}
          sx={{
            fontSize: 12,
            py: 0.5,
            "& .MuiAlert-message": { fontSize: 12 },
          }}
        >
          Menunggu {pendingMembers.length} anggota lagi untuk voting:&nbsp;
          <strong>{pendingMembers.map((m) => m.username).join(", ")}</strong>
        </Alert>
      </Collapse>
      <Collapse in={votedCount === 0}>
        <Alert
          severity="info"
          icon={<HowToVoteOutlinedIcon fontSize="small" />}
          sx={{
            fontSize: 12,
            py: 0.5,
            "& .MuiAlert-message": { fontSize: 12 },
          }}
        >
          Setiap anggota tim wajib melakukan voting difficulty sebelum estimasi
          dikunci.
        </Alert>
      </Collapse>
      <Box sx={{ display: "flex", gap: 1 }}>
        {DIFFICULTY_OPTIONS.map((opt) => {
          const isSelected = currentUserVote === opt.key;
          const isWinner = revealed && winner === opt.key;

          return (
            <Box
              key={opt.key}
              onClick={() => !revealed && handleVote(opt.key)}
              sx={{
                flex: 1,
                border: `1px solid ${isSelected || isWinner ? opt.border : "#D9D9D9"}`,
                borderRadius: "4px",
                padding: "10px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                cursor: revealed ? "default" : "pointer",
                background: isSelected
                  ? opt.bg
                  : isWinner
                    ? `${opt.bg}CC`
                    : "white",
                transition: "all 0.18s ease",
                position: "relative",
                "&:hover": !revealed
                  ? {
                      borderColor: opt.border,
                      background: opt.bg,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${opt.color}22`,
                    }
                  : {},
              }}
            >
              {isWinner && (
                <EmojiEventsOutlinedIcon
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -8,
                    fontSize: 18,
                    color: "#f59e0b",
                    background: "white",
                    borderRadius: "50%",
                  }}
                />
              )}
              <Typography fontSize={18}>{opt.emoji}</Typography>
              <Typography
                variant="body2"
                fontWeight={isSelected || isWinner ? 500 : 400}
                color={isSelected || isWinner ? opt.color : "text.primary"}
              >
                {opt.label}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={isSelected || isWinner ? 500 : 400}
                color={isSelected || isWinner ? opt.color : "text.secondary"}
              >
                {opt.points} pts
              </Typography>
              {revealed && (
                <Box sx={{ width: "100%", mt: 0.5 }}>
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      background: "#E5E7EB",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${members.length > 0 ? (tally[opt.key] / members.length) * 100 : 0}%`,
                        background: opt.color,
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    fontSize={10}
                    color="text.secondary"
                    textAlign="center"
                    mt={0.25}
                  >
                    {tally[opt.key]} vote
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={500}
          mb={0.75}
          display="block"
        >
          Status Voting ({votedCount}/{members.length})
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {members.map((member) => {
            const memberVote = getMemberVote(member.id);
            const voteOpt = memberVote ? getDiffOption(memberVote) : null;
            const hasVoted = !!memberVote;

            return (
              <Tooltip
                key={member.id}
                title={
                  hasVoted
                    ? revealed
                      ? `${member.username}: ${memberVote} (${voteOpt?.points} pts)`
                      : `${member.username}: sudah vote ✓`
                    : `${member.username}: belum vote`
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    padding: "3px 8px 3px 4px",
                    borderRadius: "20px",
                    border: `1px solid ${hasVoted ? (voteOpt?.border ?? "#86efac") : "#E5E7EB"}`,
                    background:
                      hasVoted && revealed
                        ? voteOpt?.bg
                        : hasVoted
                          ? "#F0FDF4"
                          : "#F9FAFB",
                    transition: "all 0.2s",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: 10,
                      bgcolor: hasVoted
                        ? (voteOpt?.color ?? "#16a34a")
                        : "#9CA3AF",
                    }}
                  >
                    {member.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography
                    fontSize={11}
                    color={
                      hasVoted
                        ? (voteOpt?.color ?? "text.primary")
                        : "text.secondary"
                    }
                    fontWeight={hasVoted ? 600 : 400}
                  >
                    {member.username}
                  </Typography>
                  {hasVoted ? (
                    revealed ? (
                      <Typography
                        fontSize={10}
                        color={voteOpt?.color}
                        fontWeight={700}
                      >
                        {voteOpt?.emoji}
                      </Typography>
                    ) : (
                      <CheckCircleOutlinedIcon
                        sx={{ fontSize: 13, color: "#16a34a" }}
                      />
                    )
                  ) : (
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        border: "1.5px dashed #D1D5DB",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
      {revealed && winner && (
        <Box
          sx={{
            borderRadius: "8px",
            padding: "10px 14px",
            background: `${getDiffOption(winner)?.bg}`,
            border: `1.5px solid ${getDiffOption(winner)?.border}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EmojiEventsOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
          <Box>
            <Typography
              fontSize={12}
              fontWeight={700}
              color={getDiffOption(winner)?.color}
            >
              Hasil Voting: {winner} — {getDiffOption(winner)?.points} Points
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              Difficulty card telah diperbarui sesuai hasil voting tim.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
