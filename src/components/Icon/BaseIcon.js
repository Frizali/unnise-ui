import { useTheme } from "@mui/material/styles";
import { cloneElement } from "react";

const BaseIcon = ({
  children,
  active = false,
  variant = "default",
  size = 20,
}) => {
  const theme = useTheme();

  const colors = {
    default: theme.palette.icon.main,
    primary: theme.palette.primary.main,
  };

  const color = active
    ? theme.palette.primary.main
    : colors[variant];

  return cloneElement(children, {
    size,
    color,
    stroke: color,
  });
};
export default BaseIcon;    