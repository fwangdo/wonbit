import { useState } from "react";
import { 
  WALLET
  , HIST
  , IWallet
  , IHistory
  , ITrans
  , TransType
  , BUY, SELL 
} from "../Components/Data";
import { InsufficientCoinError
  , InsufficientFundsError
  , UserNotFoundError
  , AuthError  
  , AppError } from "../errors/AppErrors";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useAuthStore } from "../stores/authStore";
import { TradingService, TradeRequest } from "../services/tradingServices"; 


export function useTrading(coinId: string ) {
    const userId = useAuthStore(state => state.userId); 
    const [isTrading, setIsTrading] = useState(false); 
    const { handleError } = useErrorHandler(); 

    const executeTrade = async (type: TransType, amount: number, price: number) => {
        if (!userId) {
            throw new AuthError(); 
        }

        if (!coinId) {
            throw new AppError(
                'no coin id'
                , 'INVALID COIN'
                , 'There is no coin info'
                , false
            );  
        }

        try {
            setIsTrading(true); 
            // const total = price * amount; 
            // executeTradeLogin(userId, type, total, coinId, amount, price)

            const request: TradeRequest = {
              userId
              , coinId
              , type
              , amount
              , price
            }

            // validation 
            TradingService.validateTradeRequest(request); 

            // execution. 
            const result = await TradingService.executeTrade(request); 

            if (!result.success) {
              handleError(result.error!); 
              return { success: false }; 
            }

            return { success: true, transactionId: result.transactionId };  

        } catch (err) {
            handleError(err); 
            return { success: false}; 
        } finally {
            setIsTrading(false); 
        }
    }

    return { executeTrade, isTrading, userId }; 
}; 