import { FormGroup, FormLabel, TextField, FormHelperText } from "@mui/material";

const UiFormGroup = ({ 
    children, 
    id,
    type="text",
    size="small",
    placeholder="",
    helperText="",
    error,
    ...props 
}) => {
    return (
        <FormGroup>
            <FormLabel htmlFor={id}>{children}</FormLabel>
            <TextField
                error={error}
                id={id}
                size={size}
                placeholder={placeholder}
                type={type}
                {...props}
            />
            {helperText.trim().length > 0 && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormGroup>
    );
}

export default UiFormGroup;