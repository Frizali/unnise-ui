import { Box, Typography, Tooltip } from "@mui/material";
import { useState, useRef, useEffect } from "react";

const GAP = 6;
const OVERFLOW_WIDTH = 42;

export default function LabelGroup({ labels = [] }) {
  const containerRef = useRef(null);
  const [maxVisible, setMaxVisible] = useState(labels.length);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculate = () => {
      const containerWidth = containerRef.current.offsetWidth;

      const temp = document.createElement("div");
      temp.style.cssText =
        "position:absolute; visibility:hidden; display:flex; gap:6px; top:-9999px;";
      document.body.appendChild(temp);

      const widths = labels.map((label) => {
        const chip = document.createElement("div");
        chip.style.cssText =
          "padding: 4px 10px; border-radius:8px; font-size:12px; font-weight:600; white-space:nowrap;";
        chip.innerText = label.name;
        temp.appendChild(chip);
        return chip.offsetWidth;
      });

      document.body.removeChild(temp);

      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < widths.length; i++) {
        const isLast = i === widths.length - 1;
        const neededWidth = totalWidth + widths[i] + (i > 0 ? GAP : 0);
        const withOverflow = neededWidth + GAP + OVERFLOW_WIDTH;

        if (isLast && neededWidth <= containerWidth) {
          count = i + 1;
        } else if (!isLast && withOverflow <= containerWidth) {
          count = i + 1;
          totalWidth = neededWidth;
        } else {
          break;
        }
      }

      setMaxVisible(count);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [labels]);

  const visible = labels.slice(0, maxVisible);
  const hidden = labels.slice(maxVisible);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: `${GAP}px`,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {visible.map((label) => (
        <Tooltip key={label.id} title={label.description || label.name} arrow>
          <Box
            sx={{
              px: "10px",
              py: "4px",
              borderRadius: "4px",
              background: `${label.color}30`,
              cursor: "default",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <Typography
              fontSize={14}
              fontWeight={500}
              sx={{ color: label.color }}
            >
              {label.name}
            </Typography>
          </Box>
        </Tooltip>
      ))}

      {hidden.length > 0 && (
        <Tooltip
          arrow
          title={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                p: "4px 10px",
              }}
            >
              {hidden.map((label) => (
                <Box
                  key={label.id}
                  sx={{
                    px: "8px",
                    py: "3px",
                    borderRadius: "4px",
                    background: `${label.color}30`,
                  }}
                >
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    sx={{ color: label.color }}
                  >
                    {label.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          }
        >
          <Box
            sx={{
              px: "10px",
              py: "4px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.06)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <Typography fontSize={14} fontWeight={500} color="text.secondary">
              +{hidden.length}
            </Typography>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
