import { TransType } from "../Components/Data";
import { StorageService } from "./storageService";
import { WalletService } from "./walletService";
import { HistoryService } from "./historyService";
import { AppError, CoinNotFoundError, UserNotFoundError } from "../errors/AppErrors";

export interface TradeRequest {
    userId: string;
    coinId: string;
    type: TransType;
    amount: number;
    price: number;
}

export interface TradeResult {
    success: boolean; 
    transactionId?: string;
    error?: string; 
}

export class TradingService {
    static async executeTrade(request: TradeRequest): Promise<TradeResult> {
        try {
            const { userId, coinId, type, amount, price} = request;
            const total = amount * price;

            const userWallet = StorageService.getUserWallet(userId); 
            const userHistory = StorageService.getUserHistory(userId);  

            const updatedWallet = WalletService.processTransaction(
                userWallet,
                type, 
                coinId, 
                amount,
                total
            ); 

            const updatedHistory = HistoryService.addTransaction(
                userHistory, 
                type, 
                coinId,
                amount,
                total
            ); 

            StorageService.updateUserWallet(updatedWallet); 
            StorageService.updateUserHistory(updatedHistory); 

            const transactionId = `${userId}-${Date.now()}`; 
            return {
                success: true, 
                transactionId
            };

        } catch (error) {
            return {
                success: false, 
                error: error instanceof Error ? error.message : 'Unknoown error occurred.' 
            };
        }
    } 

    static validateTradeRequest(request: TradeRequest): void {
        const { userId, coinId, amount, price } = request; 
    
        if (!userId) {
            throw new UserNotFoundError(userId); 
        }

        if (!coinId) {
            throw new CoinNotFoundError(coinId);  
        }
    }
}; 