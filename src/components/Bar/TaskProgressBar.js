import { Box, Tooltip } from "@mui/material";

export function TaskProgressBar({ columns, tasks }) {
  const taskCountByColumn = columns
    .map((col) => {
      const count = tasks.filter((t) => t.columnId === col.id).length;
      return {
        ...col,
        count,
      };
    })
    .filter((t) => t.count > 0);

  const totalTasks = tasks.length;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: 140,
        height: 32,
        overflow: "hidden",
      }}
    >
      {taskCountByColumn.map((col, index) => {
        if (col.count === 0) return null;

        const width = (col.count / totalTasks) * 140;
        const totalColumn =
          taskCountByColumn.filter((t) => t.count > 0).length - 1;

        return (
          <Tooltip
            key={col.id}
            title={`${col.title} ${col.count}`}
            placement="top"
          >
            <Box
              sx={{
                cursor: "pointer",
                width,
                height: 24,
                backgroundColor: col.color,
                transition: "height 0.2s ease",
                borderRadius:
                  index === 0 && index == totalColumn
                    ? "4px"
                    : index === 0
                      ? "4px 0 0 4px"
                      : index === totalColumn
                        ? "0 4px 4px 0"
                        : "0",
                "&:hover": {
                  height: 32,
                },
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
