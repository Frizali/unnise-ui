import { Box, Dialog, Typography, Divider } from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import UiFormGroup from "../../../components/UiFormGroup/UiFormGroup";
import UiButton from "../../../components/UiButton/UiButton";
import { ColorSwatch } from "./ColorSwatch";
import { useColumn } from "../hooks/useColumn";

export function AddColumnModal({ showModal, onClose, onAddColumn }) {

  const { color, setColor, COLOR_OPTIONS, handleChange, create } = useColumn({
    onAddColumn
  });

  return (
    <Dialog open={showModal}>
      <Box sx={{ padding: "1.5rem", boxSizing: "border-box" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" fontWeight="600" color="text.primary">
            New Option
          </Typography>
          <UiButtonIcon title="Close" onClick={onClose}>
            <CloseOutlinedIcon />
          </UiButtonIcon>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Assign points for completing tasks, deadlines, and collaboration
          activities.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
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
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.primary">
                Color
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                borderRadius: 12,
              }}
            >
              {COLOR_OPTIONS.map((c) => (
                <ColorSwatch
                  key={c.value}
                  value={c.value}
                  selected={color === c.value}
                  onClick={setColor}
                />
              ))}
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1,
            }}
            onClick={create}
          >
            <UiButton>Save</UiButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
