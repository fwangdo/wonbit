import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCurPrice } from "../api"; 
import { useQuery } from "@tanstack/react-query"; 
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
 } from "./Data";
import { IReactProps } from "../Components/Member"; 
import { InsufficientCoinError, InsufficientFundsError, UserNotFoundError, ApiError, AppError } from "../errors/AppErrors";
import { useErrorHandler } from "../hooks/useErrorHandler";


function ContainerDiv({ children }: IReactProps) {
  return (
    <div className={`
      w-[800px]
      border-[1px]
      border-solid
      border-[#ccc]
      rounded-[4px]
      overflow-hideen 
      font-sans 
    `}>
      {children}
    </div>
  )
}

function TabMenuDiv({ children }: IReactProps) {
  return (<div className={`
    flex
    border-b    
    border-[#ccc]
    border-solid
  `}>
    {children}
  </div>)
}

function TabDiv({ 
  children, 
  active, 
  onClick 
}: IReactProps & {active: boolean, onClick:(value: string) => void}) {
 const color = active ? "text-red" : "text-gray";
 const border_bw = active ? "border-b-[2px]" : null;  
 const border_c = active ? "border-[red]" : null; 

 return (<div onClick={() => onClick("someValue")} className={`
  flex-1
  text-center
  p-[12px]
  cursor-pointer
  font-bold
  ${color}
  ${border_bw}
  ${border_c}
 `}>
  {children}
 </div>)
}

function FormDiv({ children }: IReactProps) {
  return (<div
    className={`
      p-[16px]
      flex
      flex-col
      gap-[12px]
    `}
  >
    {children}
  </div>)
}

function RowDiv( {children }: IReactProps ) {
  return (<div
    className={`
        flex
        justify-center 
        items-center
      `}
  >
    {children}
  </div>)
}

function Label({ children }: IReactProps) {
  return(<label className={`text-[14px]`}>
    {children}
  </label>)
} 

function Input({
  type, 
  value, 
  onChange
}: { 
  type: string,
  value: string | number, 
  onChange?: React.ChangeEventHandler<HTMLInputElement>}
) {
  return (<input 
    type={type} 
    value={value} 
    // note that how to use conditional usage in jsx. 
    {...(onChange ? {onChange} : {})}
    className={`
    flex-1
    ml-[10px]
    p-[8px]
    text-[14px]
  `}/>)
}

function PercentButtons({ children }: IReactProps) {  
  return (
    <div 
    className={`
      flex
      gap-[8px]
    `}>
      {children}
    </div>
  ); 
}

function PercentBtn( { 
  children, 
  onClick }: IReactProps & {
    index?: number;
    onClick?: React.MouseEventHandler<HTMLButtonElement>
  }) {
  return (<button
    onClick={onClick}
    className={`
      flex-1
      p-[6px]
      text-[14px]
      bg-[#eee]
      border-[1px]
      border-[#ccc]
      cursor-pointer
      hover:bg-[#ddd]
      `}
  >
    {children}
    </button>)
} 

function StyledBtn({
  children
  , onClick
}: IReactProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (<button
    onClick={onClick}
    className={`
      flex-1 
      p-[10px]
      text-[16px]
      mx-[5px]
      bg-[#007bff]
      text-white
      border-none
      cursor-pointer
      hover:bg-[#0056b3]
    `}
  >
    {children}
  </button>) 
}

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
function changeData(userId: string, type: TransType, total: number, coinId: string, amount: number, price: number) {
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


export function TradePanel() {
    // hook should be on the top always!
    const userId = useRecoilValue(userIdState); 
    const { coinId } = useParams<{coinId : string}>(); 
    const [activeTab, setActiveTab] = useState("buy");
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    
    // error handling. 
    const { error, handleError, clearError } = useErrorHandler(); 
    
    const { data: curPriceData, isLoading: isCurPriceLoading, error: curPriceError } = useQuery({ 
        queryKey: [ 'curPrice', coinId ],
        queryFn: () => {
            // handling nullabe case. 
            if (!coinId) {
                throw new ApiError('coinId is required', false);  
            }
            return fetchCurPrice(coinId)
        },  
        enabled: !!coinId
    }); 
    
    // if you use setPrice directly, it would cause re-rendering, then it leads infinite recursion. 
    useEffect(() => {
        if (curPriceData) {
            const curPrice = curPriceData.market_data.current_price.usd;
            setPrice(curPrice);
        }
    }, [curPriceData]);

    // hook done. 
    if (!userId) return <div>Fail</div>;
    if (!coinId) return <div>Fail</div>; 

    const handleChange = (type: TransType) => {
      try {
        changeData(userId, type, total, coinId, amount, price); 
        setAmount(0); 
        alert(`주문이 완료되었습니다.`)
      } catch (err) {
          handleError(err); 
          alert(error?.userMessage)
      }
    }
   

    if (isCurPriceLoading) return <div>Loading..</div>;
    if (curPriceError || (!curPriceData)) return <div>Fail</div>;

    const total = price * amount;

    // retry function. 
    const handleRetry = () => {
        if (activeTab) {
            handleChange(activeTab as TransType);
        }
    };


    const TradeForBuy = () => { 
        return (
            <FormDiv>
            <RowDiv>
                <Label>매수가격 (USD)</Label>
                <Input type="number" value={price} />
            </RowDiv>

            <RowDiv>
                <Label>주문수량 (BTC)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </RowDiv>

            <PercentButtons>
                {[10, 25, 50, 100].map((percent) => (
                // key is a special argument. 
                <PercentBtn key={percent} onClick={() => setAmount((percent / 100) * 1)}>{percent}%</PercentBtn>
                ))}
                <PercentBtn>직접입력</PercentBtn>
            </PercentButtons>

            <RowDiv>
                <Label>주문총액 (USD)</Label>
                <div>{total.toLocaleString()} USD</div>
            </RowDiv>

            <StyledBtn onClick={() => handleChange(BUY)}>매수</StyledBtn>
            </FormDiv>
        );
    }


    const TradeForSell = () => { 
        return (
            <FormDiv>
            <RowDiv>
                <Label>매도가격 (USD)</Label>
                <Input type="number" value={price} />
            </RowDiv>

            <RowDiv>
                <Label>매도수량 (BTC)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </RowDiv>

            <RowDiv>
                <Label>주문총액 (USD)</Label>
                <div>{total.toLocaleString()} USD</div>
            </RowDiv>

            <StyledBtn onClick={() => handleChange(SELL)}>매도</StyledBtn>
            </FormDiv>
        );
    }

  return (
    <ContainerDiv>
      <TabMenuDiv>
        <TabDiv active={activeTab === "buy"} onClick={() => setActiveTab("buy")}>매수</TabDiv>
        <TabDiv active={activeTab === "sell"} onClick={() => setActiveTab("sell")}>매도</TabDiv>
      </TabMenuDiv>

      {(activeTab === "buy" && (
        <TradeForBuy />
      )) || (
        activeTab === "sell" && (
        <TradeForSell />
        )
      )}
    </ContainerDiv>
  );
}
