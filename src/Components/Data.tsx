export const USERS = "users";
export const WALLET = "wallet";
export const HIST = "history"; 
export const BUY = "buy"; 
export const SELL = "sell"; 

export interface IUser {
    id: string;
    pwd: any;
    name: string;
    loc: string; 
}

export interface IWallet {
    id: string; 
    usd: number;
    coins: Object; 
}

export type TransType = "buy" | "sell"; 

export interface ITrans {
    date: number;
    type: TransType; 
    coin: string;
    amount: number; 
    price: number; 
}

export interface IHistory {
    id: string; 
    data: Array<ITrans>;
} 