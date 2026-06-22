import { Box } from "@mui/material";
import UiButtonIconText from "../../../components/UiButton/UiButtonIconText";
import { TaskProgressBar } from "../../../components/Bar/TaskProgressBar";
import BaseIcon from "../../../components/Icon/BaseIcon";
import { Search, CircleUserRound, Funnel, ArrowDownUp } from "lucide-react";

const FILTER_ACTIONS = [
  { label: "Search", icon: <BaseIcon><Search /></BaseIcon> },
  { label: "Person", icon: <BaseIcon><CircleUserRound/></BaseIcon> },
  { label: "Filter", icon: <BaseIcon><Funnel /></BaseIcon> },
  { label: "Sort", icon: <BaseIcon><ArrowDownUp /></BaseIcon> },
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