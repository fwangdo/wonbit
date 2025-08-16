export class AppError extends Error {
    constructor(
        message: string,  
        public code: string, 
        public userMessage: string, 
        public isRetryable: boolean = false
    ) {
        super(message); 
        this.name = this.constructor.name;
    }
}


// error of business logic. 
export class InsufficientFundsError extends AppError { 
    constructor(required: number, available: number) {
        super(
            `Insufficient funds: required ${required}, available ${available}`, 
            `INSUFFICIENT_FUNDS`, 
            `There is not enough usd change. required -> $${required.toFixed(2)}, current -> $${available.toFixed(2)}`,  
            false 
        ); 
    }
}

export class InsufficientCoinError extends AppError {
    constructor(coinId: string, required: number, available: number) {
        super(
            `Insufficient coinds: coin id -> ${coinId}, required -> ${required}, available -> ${available}`,
            `INSUFFICIENT_COIN`,
            `There is not enough ${coinId}. required -> ${required}, available -> ${available}`,
            false 
        ); 
    }
}

export class UserNotFoundError extends AppError{
    constructor(userId: string) {
        super(
            `User not found: ${userId}`,
            `USER_NOT_FOUND`,
            `Cannot find user information. Please check out information again.`,
            false
        ); 
    }
}

export class CoinNotFoundError extends AppError{
    constructor(coinId: string) {
        super(
            `Coin not found: ${coinId}`,
            `COIN_NOT_FOUND`,
            `Cannot find coin information. Please check out information again.`,
            false
        ); 
    }
}

export class AuthError extends AppError {
    constructor() {
        super(
            'User not authenticated'
            , 'AUTH_ERROR'
            , 'Login'
            , false 
        ); 
    }
}

export class ApiError extends AppError {
    constructor(message: string, isRetryable: boolean = true) {
        super(
            message,
            'API_ERROR',
            'There is a problem in connection to server. Please try it again', 
            isRetryable
        )
    }
}