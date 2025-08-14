import { useState } from 'react'; 
import { AppError } from '../errors/AppErrors'; 

export function useErrorHandler() {
    const [error, setError] = useState<AppError | null>(null);

    const handleError = (error: unknown) => {
        if (error instanceof AppError) {
            setError(error); 
        } else if (error instanceof Error) {
            setError(new AppError(
                error.message, 
                `UNKNOWN_ERROR`, 
                `There is error that is not in AppError.`, 
                false 
            ));
        } else {
            setError(new AppError(
                `Unknown error`, 
                `UNKNOWN_ERROR`,
                `There is unknown error`, 
                false 
            ))
        }
    }

    const clearError = () => setError(null); 

    return { error, handleError, clearError }; 
}