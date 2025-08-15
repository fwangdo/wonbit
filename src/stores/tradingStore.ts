import { create } from 'zustand'; 
import { devtools } from 'zustand/middleware'; 

interface TradingState {
  amount: number;
  activeTab: 'buy' | 'sell';
}

interface TradingActions {
  setAmount: (amount: number) => void;
  setActiveTab: (tab: 'buy' | 'sell') => void;
  resetAmount: () => void;
}

type TradingStore = TradingState & TradingActions;  

export const useTradingStore = create<TradingStore>() (
    devtools(
        (set) => ({
            amount: 0,
            activeTab: 'buy', 

            setAmount: (amount: number) => 
                set({amount: amount}, false, 'setAmount'), 

            setActiveTab: (activeTab: 'buy' | 'sell') =>
                set({ activeTab: activeTab }, false, 'setActiveTab'), 
            
            resetAmount: () =>
                set({ amount: 0}, false, 'resetAmount')

        }), {name: 'trading-store'}
    )
)