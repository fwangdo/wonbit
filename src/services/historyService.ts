import { IHistory, ITrans, TransType } from "../Components/Data";

export class HistoryService {

    static addTransaction(
        history: IHistory
        , type: TransType
        , coinId: string
        , amount: number
        , price: number 
    ): IHistory {

        const newTransaction: ITrans = {
            date: Date.now(),  
            type: type,
            coin: coinId, 
            amount: amount,
            price: price 
        }

        return {
            ...history
            , data: [...history.data, newTransaction] 
        }
    }
}