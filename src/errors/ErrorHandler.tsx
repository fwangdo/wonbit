import React, { useEffect } from "react"; 
import { AppError } from "./AppErrors";

interface ErrorToastProps {
    error: AppError; 
    onRetry?: () => void;  
    onClose: () => void; 
}

export function ErrorToast(
    {error, onRetry, onClose}: ErrorToastProps
) {
    alert(error.userMessage); 
    onClose(); 

    return null; 
    // return (
    //     <div className={`fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md`}>
    //         <div className="flex justify-between items-start">
    //             <div>
    //                 <p className="font-medium">{error.userMessage}</p>
    //                 {error.isRetryable && (
    //                     <button
    //                         onClick={onRetry}
    //                         className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
    //                     >
    //                         Retry 
    //                     </button>
    //                 )}
    //             </div>
    //             <button onClick={onClose} className="text-xl">&times;</button>
    //         </div>
    //     </div>
    // );  
}