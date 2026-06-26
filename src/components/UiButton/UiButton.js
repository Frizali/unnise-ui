import { Button, Tooltip } from "@mui/material";

const iconSizes = {
  small: 18,
  medium: 22,
  large: 26,
};

const sizeStyles = {
  small: {
    height: "37px",
    fontSize: "14px",
    padding: "0 1rem",
  },
  medium14: {
    height: "40px",
    fontSize: "14px",
    padding: "0 1rem",
  },
  medium16: {
    height: "40px",
    fontSize: "16px",
    padding: "0 1rem",
  },
  large: {
    height: "50px",
    fontSize: "16px",
    padding: "0 1.25rem",
  },
};

const UiButton = ({
  children,
  color = "primary",
  disabled,
  fullWidth = false,
  loading = false,
  size = "small",
  startIcon,
  endIcon,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const currentSize = sizeStyles[size] || sizeStyles.small;
  const currentIconSize = iconSizes[size] || iconSizes.small;

  return (
    <Tooltip title={children} placement="top">
      <Button
        color={color}
        disabled={isDisabled}
        loading={loading}
        loadingPosition="end"
        startIcon={startIcon}
        endIcon={endIcon}
        fullWidth={fullWidth}
        variant="contained"
        sx={{
          minWidth: 0,
          boxShadow: "none",
          textTransform: "none",
          borderRadius: "8px",
          ...currentSize,
          "&:hover": {
            boxShadow: "none",
          },
          "& .MuiButton-startIcon": {
            marginRight: size === "small" ? "4px" : "8px",
            marginLeft: 0,

            "& svg": {
              width: currentIconSize,
            },
          },
        }}
        {...props}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default UiButton;
