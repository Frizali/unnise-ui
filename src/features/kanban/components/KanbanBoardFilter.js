import { Box } from "@mui/material";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import { TaskProgressBar } from "../../../components/Bar/TaskProgressBar";

export function KanbanBoardFilter({ colums, tasks }) {
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
        <UiButtonIconText icon={<SearchOutlinedIcon fontSize="small" />}>
          Search
        </UiButtonIconText>
        <UiButtonIconText icon={<AccountCircleOutlinedIcon fontSize="small" />}>
          Person
        </UiButtonIconText>
        <UiButtonIconText icon={<FilterAltOutlinedIcon fontSize="small" />}>
          Filter
        </UiButtonIconText>
        <UiButtonIconText icon={<SwapVertOutlinedIcon fontSize="small" />}>
          Sort
        </UiButtonIconText>
      </Box>
      <TaskProgressBar columns={colums} tasks={tasks} />
    </Box>
  );
}
