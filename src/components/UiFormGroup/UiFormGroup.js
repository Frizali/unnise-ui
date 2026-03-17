import { FormGroup, FormLabel, TextField, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";

const UiFormGroup = ({
  children,
  id,
  type = "text",
  size = "small",
  placeholder = "",
  helperText = "",
  error = "",
  ...props
}) => {
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setErrorText(error);
  }, [error]);

  const isValidationError = (error = "") => {
    return error.trim().length > 0;
  };

  return (
    <FormGroup>
      <FormLabel
        sx={{
          fontSize: size === "extraSmall" ? "14px" : "1rem",
        }}
        htmlFor={id}
      >
        {children}
      </FormLabel>
      <TextField
        size={size === "medium" ? "medium" : "small"}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: size === "extraSmall" ? "14px" : "1rem",
          },
        }}
        error={isValidationError(errorText)}
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
        {...props}
      />
      {isValidationError(errorText) && (
        <FormHelperText error>{errorText}</FormHelperText>
      )}
      {helperText.trim().length > 0 && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormGroup>
  );
};

export default UiFormGroup;
