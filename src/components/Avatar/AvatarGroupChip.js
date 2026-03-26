import { useState, useRef, useEffect } from "react";
import { Box, Avatar, AvatarGroup, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  borderRadius: 20,
  maxWidth: "100%",
  overflow: "hidden",
  width: "100%",
}));

const OverflowBadge = styled(Avatar)(() => ({
  width: 32,
  height: 32,
  fontSize: 12,
  color: "#fff",
  border: "2px solid #fff",
  flexShrink: 0,
}));

function useParentWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    setWidth(parent.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function calcVisibleCount(users, availableWidth) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "500 13px sans-serif";

  let count = users.length;
  while (count > 1) {
    const names = users.slice(0, count).map((u) => u.username).join(", ");
    const overflowStr = count < users.length ? `, +${users.length - count}` : "";
    const totalWidth = ctx.measureText(names + overflowStr).width;
    if (totalWidth <= availableWidth) break;
    count--;
  }
  return count;
}


export function AvatarGroupChip({ users }) {
  const containerRef = useRef(null);
  const parentWidth = useParentWidth(containerRef);
  const [visibleCount, setVisibleCount] = useState(users.length);

  useEffect(() => {
    if (parentWidth === 0) return;

    const AVATAR_SIZE = 32;
    // const AVATAR_OVERLAP = 8;
    const CHIP_PADDING = 14 + 10;
    const GAP = 4;

    // const avatarAreaWidth = AVATAR_SIZE + (users.length - 1) * (AVATAR_SIZE - AVATAR_OVERLAP);
    const avatarAreaWidth = AVATAR_SIZE;

    const availableForText = parentWidth - avatarAreaWidth - CHIP_PADDING - GAP;

    const count = calcVisibleCount(users, Math.max(availableForText, 0));
    setVisibleCount(count);
  }, [parentWidth, users]);

  const visibleUsers = users.slice(0, visibleCount);
  const hiddenUsers = users.slice(visibleCount);
  const overflow = hiddenUsers.length;

  const nameText = visibleUsers.map((u) => u.username).join(", ");
  const overflowText = overflow > 0 ? `, +${overflow}` : "";

  return (
    <Tooltip
      title={overflow > 0 ? hiddenUsers.map((u) => u.username).join(", ") : ""}
      arrow
      disableHoverListener={overflow === 0}
    >
      <StyledChip ref={containerRef}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AvatarGroup>
            {visibleUsers.map((user, i) => {
              return (
                <Avatar sx={{width:24, height:24, fontSize:"12px"}} key={user.id}>
                  {user.username[0].toUpperCase()}
                </Avatar>
              )
            })}
          </AvatarGroup>
          {overflow > 0 && (
            <OverflowBadge sx={{ ml: "-8px", zIndex: 0 }}>
              +{overflow}
            </OverflowBadge>
          )}
        </Box>

        <Typography
          noWrap
          sx={{ fontSize: 14, minWidth: 0, flexShrink: 1 }}
          color="text.primary"
        >
          {nameText}
          {overflowText && (
            <Box component="span" sx={{ color: "#888", fontWeight: 400 }}>
              {overflowText}
            </Box>
          )}
        </Typography>
      </StyledChip>
    </Tooltip>
  );
}
