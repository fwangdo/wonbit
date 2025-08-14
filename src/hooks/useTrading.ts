import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil"; 
import { userIdState } from "../atoms/Atom";
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


// wallet. 
function reflectBuyOnWallet(userWallet: IWallet, total: number, coinId: string, amount: number): IWallet {
    const curUsd = userWallet.usd;
    if (curUsd < total) {
      throw new InsufficientFundsError(total, userWallet.usd); 
    }

    const newUsd = userWallet.usd - total; 
    let newCoinAmount = 0 
    if (coinId in userWallet.coins) {
        newCoinAmount = userWallet.coins[coinId];
    }

    newCoinAmount += amount; 
    return {
      id: userWallet.id,  
      usd: newUsd,  
      coins: {
        ...userWallet.coins, 
        [coinId]: newCoinAmount
      }
    }; 
}

// TODO: no side effect. 
function reflectSellOnWallet(userWallet: IWallet, total: number, coinId: string, amount: number): IWallet {
    const curCoin = userWallet.coins[coinId] ?? 0; 
    if (curCoin < amount) {
        throw new InsufficientCoinError(coinId, amount, curCoin); 
    }

    const newCoinAmount = curCoin - amount;
    const newUsd = userWallet.usd + total; 

    return {
      id: userWallet.id
      , usd: newUsd
      , coins: {
        ...userWallet.coins
        , [coinId]: newCoinAmount
      }
    }
}

function reflectOnWallet(type: TransType, userWallet: IWallet, total: number, coinId: string, amount: number): IWallet {
  if (type === BUY) {
    return reflectBuyOnWallet(userWallet, total, coinId, amount); 
  } else {
    return reflectSellOnWallet(userWallet, total, coinId, amount); 
  }
}


function reflectBuyOnHist(userHist: IHistory, total: number, coinId: string, amount: number, price: number): IHistory {
  // we can posit that the trade that use made is possible. 
  const curDate = Date.now(); 
  const curTrans: ITrans= { 
    date: curDate
    , type: BUY
    , coin: coinId 
    , amount: amount
    , price: price
  }; 
  
  return {
    id: userHist.id, 
    data: [...userHist.data, curTrans]
  }; 
}

function reflectSellOnHist(userHist: IHistory, total: number, coinId: string, amount: number, price: number): IHistory {
  // we can posit that the trade that use made is possible. 
  const curDate = Date.now(); 
  const curTrans: ITrans= { 
    date: curDate
    , type: SELL  
    , coin: coinId 
    , amount: amount
    , price: price
  }; 
  
  return {
    id: userHist.id, 
    data: [...userHist.data, curTrans]
  }; 
}

function reflectOnHist(type: TransType, userHist: IHistory, total: number, coinId: string, amount: number, price: number): IHistory {
  if (type === BUY) {
    return reflectBuyOnHist(userHist, total, coinId, amount, price); 
  } else {
    return reflectSellOnHist(userHist, total, coinId, amount, price); 
  }
}

// get new wallets. 
function genNewDatas<T extends {id: string}>(userId: string, userDatas: T[], newUserData: T): T[] {
    const idx = userDatas.findIndex((Data) => Data.id === userId); 
    if (idx === -1) {
      // throw new Error(`${userId} does not exist in Data`)
      throw new UserNotFoundError(userId); 
    }

    return [
      ...userDatas.slice(0, idx)
      , newUserData
      , ...userDatas.slice(idx + 1),
    ]; 
};

// change data. 
function executeTradeLogin(userId: string, type: TransType, total: number, coinId: string, amount: number, price: number) {
    const tempWalletData = localStorage.getItem(WALLET);
    const tempHistData = localStorage.getItem(HIST);  

    if (!tempWalletData || !tempHistData) {
        throw new UserNotFoundError(userId); 
    }

    const walletData: IWallet[] = JSON.parse(tempWalletData); 
    const histData: IHistory[] = JSON.parse(tempHistData); 

    const userWallets = walletData.filter((data) => data.id === userId); 
    const userHistories = histData.filter((data) => data.id === userId );  

    if (userWallets.length !== 1 || userHistories.length !== 1) {
        throw new UserNotFoundError(userId); 
    } 

    const userWallet = userWallets[0]; 
    const userHistory = userHistories[0]; 
    
    // wallet change
    const newUserWallet = reflectOnWallet(type, userWallet, total, coinId, amount); 

    // hist change. 
    const newUserHist = reflectOnHist(type, userHistory, total, coinId, amount, price); 

    // update.. 
    const newWalletData = genNewDatas(userId, walletData, newUserWallet); 
    const newHistData = genNewDatas(userId, histData, newUserHist);

    // TODO: changen new userWallet. 
    localStorage.setItem(WALLET, JSON.stringify(newWalletData));
    localStorage.setItem(HIST, JSON.stringify(newHistData)); 

    return;  
}; 


export function useTrading(coinId: string ) {
    const userId = useRecoilValue(userIdState);
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
            const total = price * amount; 

            executeTradeLogin(userId, type, total, coinId, amount, price)

            return { success: true };  
        } catch (err) {
            handleError(err); 
            return { success: false}; 
        } finally {
            setIsTrading(false); 
        }
    }

    return { executeTrade, isTrading, userId }; 
}; 