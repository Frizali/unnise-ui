import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Astroid } from "lucide-react";
import { voteService } from "../../../services/voteService";

const DIFFICULTY_OPTIONS = [
  {
    key: "Low",
    label: "Low",
    points: 3,
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#86efac",
  },
  {
    key: "Medium",
    label: "Medium",
    points: 6,
    color: "#d97706",
    bg: "#fef3c7",
    border: "#fcd34d",
  },
  {
    key: "High",
    label: "High",
    points: 10,
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#fca5a5",
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
  const [deadlineReached, setDeadlineReached] = useState(false);

  const createdAt = card?.createdAt ? dayjs(card.createdAt) : null;
  const voteDeadline = createdAt ? createdAt.add(2, "day") : null;

  useEffect(() => {
    if (!voteDeadline) return;

    const now = dayjs();
    if (now.isAfter(voteDeadline)) {
      setDeadlineReached(true);
      return;
    }

    const timer = setTimeout(() => {
      setDeadlineReached(true);
    }, voteDeadline.diff(now));

    return () => clearTimeout(timer);
  }, [voteDeadline]);

  useEffect(() => {
    let mounted = true;
    const fetchVotes = async () => {
      if (!card?.id) return;
      try {
        const data = await voteService.getVotes(card.id);
        if (mounted && Array.isArray(data)) setVotes(data);
      } catch (err) {
      }
    };

    fetchVotes();

    return () => { mounted = false; };
  }, [card?.id]);

  const getMemberVote = (memberId) =>
    votes.find((v) => v.cardId === card.id && v.memberId === memberId)
      ?.difficultyId ?? null;

  const currentUserVote = getMemberVote(currentUserId);

  const allVoted =
    members.length > 0 && members.every((m) => getMemberVote(m.id) !== null);
  const votedCount = members.filter((m) => getMemberVote(m.id) !== null).length;
  

  const haveDeadlinePassed = deadlineReached;

  const [remainingMs, setRemainingMs] = useState(
    voteDeadline ? Math.max(0, voteDeadline.diff(dayjs())) : 0,
  );

  useEffect(() => {
    if (!voteDeadline) return;
    if (haveDeadlinePassed) {
      setRemainingMs(0);
      return;
    }

    const interval = setInterval(() => {
      const diff = voteDeadline.diff(dayjs());
      if (diff <= 0) {
        setRemainingMs(0);
        setDeadlineReached(true);
        clearInterval(interval);
      } else {
        setRemainingMs(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voteDeadline, haveDeadlinePassed]);

  const deadlineLabel = voteDeadline ? voteDeadline.format("DD MMM YYYY [at] HH:mm") : null;
  const timeLeftText = remainingMs > 0
    ? `${Math.floor(remainingMs / 3600000)}h ${Math.max(0, Math.floor((remainingMs % 3600000) / 60000))}m`
    : "0h 0m";

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
    if (!allVoted && !haveDeadlinePassed) return null;

    const counts = { Low: 0, Medium: 0, High: 0 };
    votes
      .filter((v) => v.cardId === card.id)
      .forEach((v) => {
        if (counts[v.difficultyId] !== undefined) counts[v.difficultyId]++;
      });

    const hasVotes = Object.values(counts).some((count) => count > 0);
    if (!hasVotes) return "Medium";

    return Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }, [allVoted, haveDeadlinePassed, votes, card.id]);

  const isVotingClosed = revealed || haveDeadlinePassed;
  const userHasVoted = currentUserVote !== null;
  const isVotingOpen = !isVotingClosed;

  const handleVote = (diffKey) => {
    if (isVotingClosed) return;
    const newVotes = [
      ...votes.filter((v) => !(v.cardId === card.id && v.memberId === currentUserId)),
      { cardId: card.id, memberId: currentUserId, difficultyId: diffKey },
    ];
    setVotes(newVotes);

    (async () => {
      try {
        await voteService.setVote(card.id, currentUserId, diffKey);
        const remote = await voteService.getVotes(card.id);
        if (Array.isArray(remote)) setVotes(remote);
      } catch (err) {
        setVotes(votes);
      }
    })();
  };

  useEffect(() => {
    if (haveDeadlinePassed && !revealed) {
      setRevealed(true);
      onUpdateDifficulty?.(winner);
    }
  }, [haveDeadlinePassed, revealed, winner, onUpdateDifficulty]);

  const getDiffOption = (key) => DIFFICULTY_OPTIONS.find((d) => d.key === key);
  const winnerOption = winner ? getDiffOption(winner) : null;

  const accordionSx = {
    boxShadow: "none",
    border: winnerOption
      ? `1px solid ${winnerOption.border}`
      : !userHasVoted && isVotingOpen
        ? "1px solid #dc2626"
        : "1px solid #D9D9D9",
    borderRadius: "8px",
    "&::before": { display: "none" },
    "&.Mui-expanded": { margin: 0 },
    "&:first-of-type": { borderRadius: "8px" },
  };

  return (
    <Accordion
      sx={accordionSx}>
      <AccordionSummary
        expandIcon={<ExpandMoreOutlinedIcon />}
        sx={{
          borderRadius: "8px",
          "&.Mui-expanded": {
            borderRadius: "8px 8px 0 0",
          },
          ...(winnerOption
            ? { color: winnerOption.color, backgroundColor: winnerOption.bg }
            : !userHasVoted && isVotingOpen
              ? { color: "error.main", backgroundColor: "#fef2f2" }
              : {}),
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            flex: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            color={!userHasVoted && isVotingOpen ? "#dc2626" : "text.primary"}
            fontWeight={500}
          >
            Difficulty
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,

            }}
          >
            <Typography fontSize={14} sx={{ color: !userHasVoted ? "#dc2626" : "text.primary", fontWeight: 500 }}>
              Time left {timeLeftText}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {DIFFICULTY_OPTIONS.map((opt) => {
              const isSelected = currentUserVote === opt.key;
              const isWinner = revealed && winner === opt.key;

              return (
                <Box
                  key={opt.key}
                  onClick={() => !isVotingClosed && handleVote(opt.key)}
                  sx={{
                    flex: 1,
                    border: `1px solid ${isSelected || isWinner ? opt.border : "#D9D9D9"}`,
                    borderRadius: "8px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    cursor: revealed ? "default" : "pointer",
                    background: isSelected
                      ? opt.bg
                      : isWinner
                        ? `${opt.bg}CC`
                        : "white",
                    transition: "all 0.18s ease",
                    position: "relative",
                    // minHeight: 180,
                    justifyContent: "space-between",
                    "&:hover": !revealed
                      ? {
                        borderColor: opt.border,
                        background: opt.bg,
                        transform: "translateY(-2px)",
                      }
                      : {},
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, justifyContent: "center", alignItems: "center" }}>
                    <Tooltip title={opt.label} placement="bottom">
                      <Astroid size={20} color={opt.color} />
                    </Tooltip>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 0.25 }}>
                      <Typography
                        fontSize={14}
                        color={isSelected || isWinner ? opt.color : opt.color}
                      >
                        {opt.label}
                      </Typography>
                      <Typography fontSize={14} color={isSelected || isWinner ? opt.color : "text.secondary"} sx={{ display: "block" }}>
                        {opt.points} points
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        {tally[opt.key] ?? 0} votes
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
            {voteDeadline && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Voting ends on {deadlineLabel} · {timeLeftText}
              </Typography>
            )}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={0.75}
              display="block"
            >
              Status ({votedCount}/{members.length})
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
                          : `${member.username}: already voted ✓`
                        : `${member.username}: not voted`
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
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}