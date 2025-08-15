import { IWallet } from "../Components/Data";
import { TransType, BUY } from "../Components/Data";
import { InsufficientCoinError, InsufficientFundsError, UserNotFoundError } from "../errors/AppErrors";

export class WalletService {
    
    static validateTransaction(
        wallet: IWallet
        , type: TransType
        , coinId: string
        , amount: number
        , total: number
    ): void {
        if (type === BUY) {
            if (wallet.usd < total) {
                throw new InsufficientFundsError(total, wallet.usd);
            }
        } else {
            const availCoin = wallet.coins[coinId] ?? 0; 
            if (availCoin < amount) {
                throw new InsufficientCoinError(coinId, amount, availCoin); 
            }
        }
    }

    static processTransaction(
        wallet: IWallet
        , type: TransType
        , coinId: string
        , amount: number
        , total: number
    ): IWallet {
        this.validateTransaction(wallet, type, coinId, amount, total);

        if (type === BUY) {
            return {
                ...wallet, 
                usd: wallet.usd - total, 
                coins: {
                    ...wallet.coins, 
                    [coinId]: (wallet.coins[coinId] ?? 0) + amount
                }
            };
        } else {
            return {
                ...wallet, 
                usd: wallet.usd + total, 
                coins: {
                    ...wallet.coins, 
                    [coinId]: wallet.coins[coinId] - amount
                }
            }
        }
    }
}
