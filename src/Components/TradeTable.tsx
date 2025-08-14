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
import { useTrading } from "../hooks/useTrading";
import { isDisabled } from "@testing-library/user-event/dist/utils";


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
  , disabled
  , onClick
}: IReactProps & {
  disabled: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (<button
    onClick={onClick}
    disabled={disabled}
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

export function TradePanel() {
    // hook should be on the top always!
    const userId = useRecoilValue(userIdState); 
    const { coinId } = useParams<{coinId : string}>(); 
    const [activeTab, setActiveTab] = useState("buy");
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    
    const { executeTrade, isTrading } = useTrading(coinId!); 
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
    if (isCurPriceLoading) return <div>Loading..</div>;
    if (curPriceError || (!curPriceData)) return <div>Fail</div>;

    const handleChange = async (type: TransType) => {
      const result = await executeTrade(type, amount, price)
      if (result.success) {
        setAmount(0); 
        alert(`The order is done.`)
      }
    }

    const total = price * amount;

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

            <StyledBtn 
              onClick={() => handleChange(BUY)}
              disabled={isTrading}
              >
              {isTrading ? "Ongoing.." : "매수"}
            </StyledBtn>
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

            <StyledBtn 
              onClick={() => handleChange(SELL)}
              disabled={isTrading}
            >
              {isTrading ? "Ongoing.." : "매도"}
            </StyledBtn>
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
