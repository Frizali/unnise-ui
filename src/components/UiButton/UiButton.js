import Button from "@mui/material/Button";

const variantMap = {
  primary: { variant: "contained", color: "primary" },
  secondary: { variant: "contained", color: "secondary" },
  outline: { variant: "outlined", color: "primary" },
  text: { variant: "text", color: "primary" },
  danger: { variant: "contained", color: "error" },
};

const UiButton = ({
  children,
  variant = "primary",
  size = "small",
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  className,
  ...prop
}) => {
  const isDisabled = disabled || loading;
  const config = variantMap[variant] || variantMap.primary;

  return (
    <Button
      {...config}
      {...prop}
      disabled={isDisabled}
      fullWidth={fullWidth}
      size={size}
      startIcon={iconLeft}
      endIcon={iconRight}
      className={className}
      loading={loading}
      loadingPosition="end"
      sx={{ boxShadow:'none', textTransform:'none' }}
    >
      {children}
    </Button>
  );
};

export default UiButton;
