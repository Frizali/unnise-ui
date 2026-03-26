import { useState } from "react";
import { Button, Popover, Stack } from "@mui/material";

export default function StatusSelect({ value, onChange, columns }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const selected = columns.find((o) => o.id === value) ?? columns[3];

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (option) => {
    onChange?.(option.id);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          width: "100%",
          color: "white",
          background: selected.color,
          borderRadius: "4px",
          textTransform: "none",
          fontSize: 14,
          justifyContent: "center",
          fontWeight: 400,
        }}
      >
        {selected.title}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: "4px",
              overflow: "hidden",
              minWidth: 200,
            },
          },
        }}
      >
        <Stack spacing={0} sx={{ p: 1.25 }}>
          {columns.map((opt) => (
            <Button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              sx={{
                color: "white",
                background: opt.color,
                borderRadius: "4px",
                textTransform: "none",
                fontSize: 14,
                mb: 0.75,
                fontWeight: 400,
                "&:last-child": { mb: 0 },
              }}
            >
              {opt.title}
            </Button>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
