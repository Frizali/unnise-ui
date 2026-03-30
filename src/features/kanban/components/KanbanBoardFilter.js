import { Box } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import { TaskProgressBar } from "../../../components/Bar/TaskProgressBar";

const FILTER_ACTIONS = [
  { label: "Search", icon: <SearchOutlinedIcon fontSize="small" /> },
  { label: "Person", icon: <AccountCircleOutlinedIcon fontSize="small" /> },
  { label: "Filter", icon: <FilterAltOutlinedIcon fontSize="small" /> },
  { label: "Sort", icon: <SwapVertOutlinedIcon fontSize="small" /> },
];

export function KanbanBoardFilter({ columns, cards }) {
  return (
    <Box
      sx={{
        borderBottom: "1px solid #D9D9D9",
        padding: "0 2.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, padding: ".5rem 0" }}>
        {FILTER_ACTIONS.map(({ label, icon }) => (
          <UiButtonIconText key={label} icon={icon}>
            {label}
          </UiButtonIconText>
        ))}
      </Box>
      <TaskProgressBar columns={columns} tasks={cards} />
    </Box>
  );
}