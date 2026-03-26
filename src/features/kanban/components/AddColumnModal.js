import { Box, Dialog, Typography, Divider } from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import UiFormGroup from "../../../components/UiFormGroup/UiFormGroup";
import UiButton from "../../../components/UiButton/UiButton";
import { ColorSwatch } from "../../../components/Swatch/ColorSwatch";
import { useColumn } from "../hooks/useColumn";

export function AddColumnModal({ showModal, onClose, onAddColumn }) {
  const { column, color, setColor, COLOR_OPTIONS, handleChange, create } =
    useColumn({
      onAddColumn,
    });

  return (
    <Dialog maxWidth="xs" open={showModal}>
      <Box sx={{ padding: "1.5rem", boxSizing: "border-box" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" fontWeight="600" color="text.primary">
            New Column
          </Typography>
          <UiButtonIcon title="Close" onClick={onClose}>
            <CloseOutlinedIcon />
          </UiButtonIcon>
        </Box>
        <Typography variant="body2" color="text.secondary">
          A stage to organize tasks and track progress, with optional points for
          completion and collaboration.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              padding: "12px 20px",
              background: "#FCFBFC",
              border: "1px solid #D9D9D9",
              borderRadius: "4px",
              minHeight: "37.125px",
            }}
          >
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <ColorSwatch size={10} value={color} />
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {column.title}
              </Typography>
            </Box>
          </Box>
          <UiFormGroup
            id="title"
            placeholder="Label Text"
            size="extraSmall"
            onChange={handleChange}
          >
            Label text
          </UiFormGroup>
          <UiFormGroup
            id="description"
            placeholder="Description"
            size="extraSmall"
            onChange={handleChange}
          >
            Description
          </UiFormGroup>
          <Box mb={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.primary" mb="2px">
                Color
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {COLOR_OPTIONS.map((c) => (
                <ColorSwatch
                  size={24}
                  key={c.value}
                  value={c.value}
                  selected={color === c.value}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
            }}
            onClick={create}
          >
            <UiButton size="medium">Create</UiButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
