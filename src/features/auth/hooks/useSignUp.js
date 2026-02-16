import { useState } from "react"
import { authService } from "../services/authService";

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState({});

    const register = async (payload) => {
        try {
            setLoading(true);
            await authService.register(payload);
        } catch (error) {
            setError(error);
            setValidationError(error.validation)
        }

        setLoading(false);
    }

    return {
        loading,
        error,
        validationError,
        register
    }
}

