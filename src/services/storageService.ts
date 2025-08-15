import { WALLET, HIST, USERS } from "../Components/Data";
import { IWallet, IHistory, IUser } from "../Components/Data";
import { AppError, UserNotFoundError } from "../errors/AppErrors";

export class StorageService {

    // Wallet. 
    static getWallets(): IWallet[] {
        const data = localStorage.getItem(WALLET); 
        return data ? JSON.parse(data) : [];
    }

    static saveWallets(wallets: IWallet[]): void {
        localStorage.setItem(WALLET, JSON.stringify(wallets)); 
    }

    static getUserWallet(userId: string): IWallet {
        const wallets = this.getWallets();  
        const walletIdx = wallets.findIndex((wallet) => (wallet.id === userId)); 

        if (walletIdx === -1) {
            throw new UserNotFoundError(userId) 
        }

        return wallets[walletIdx]; 
    }

    static updateUserWallet(updatedWallet: IWallet): void {
        const wallets = this.getWallets(); 
        const walletIdx = wallets.findIndex((wallet) => (wallet.id === updatedWallet.id)); 

        if (walletIdx === -1) {
            throw new UserNotFoundError(updatedWallet.id) 
        }

        wallets[walletIdx] = updatedWallet; 
        this.saveWallets(wallets); 
    } 

    // History 
    static getHistories(): IHistory[] {
        const data = localStorage.getItem(HIST); 
        return (data ? JSON.parse(data) : []); 
    }

    static saveHistories(histories: IHistory[]): void {
        localStorage.setItem(HIST, JSON.stringify(histories)); 
    }

    static getUserHistory(userId: string): IHistory {
        const histories = this.getHistories(); 
        const historyIdx = histories.findIndex((history) => (history.id === userId)); 

        if (historyIdx === -1) {
            throw new UserNotFoundError(userId); 
        }
        
        return histories[historyIdx];
    }

    static updateUserHistory(updatedHistory: IHistory): void {
        const histories = this.getHistories(); 
        const historyIdx = histories.findIndex((history) => (history.id === updatedHistory.id)); 

        if (historyIdx === -1) {
            throw new UserNotFoundError(updatedHistory.id); 
        }

        histories[historyIdx] = updatedHistory;
        this.saveHistories(histories); 
    }
}