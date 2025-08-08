import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { fetchCurPrice } from "../api"; 
import { useQuery } from "@tanstack/react-query"; 
import { useRecoilValue } from "recoil"; 
import { userIdState } from "../atoms/Atom";
import { USERS
    , WALLET
    , HIST
    , IWallet
    , IHistory
    , ITrans
    , TransType
    , BUY, SELL 
 } from "./Data";


const Container = styled.div`
  width: 800px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  font-family: sans-serif;
`;

const TabMenu = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

interface ITabProp {
    active?: boolean;
}

const Tab = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active', 
})<ITabProp>`
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => (props.active ? "red" : "gray")};
  border-bottom: ${(props) => (props.active ? "2px solid red" : "none")};
`;

const Form = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Input = styled.input`
  flex: 1;
  margin-left: 10px;
  padding: 8px;
  font-size: 14px;
`;

const PercentButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PercentBtn = styled.button`
  flex: 1;
  padding: 6px;
  font-size: 14px;
  background-color: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledBtn = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;


// wallet. 
function reflectBuyOnWallet(userWallet: IWallet, total: number, coinId: string, amount: number): IWallet {
    const curUsd = userWallet.usd;
    if (curUsd < total) {
        alert("you need to charge usd more. "); 
        throw new Error(`current usd -> ${curUsd} but total number -> ${total}`);
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
        alert("you do not have enough coin."); 
        throw new Error(`current usd -> ${curCoin} but total number -> ${total}`);
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
      throw new Error(`${userId} does not exist in Data`)
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
        throw new Error(`walletData -> ${tempWalletData}, histData -> ${tempHistData}`)
    }

    const walletData: IWallet[] = JSON.parse(tempWalletData); 
    const histData: IHistory[] = JSON.parse(tempHistData); 

    const userWallets = walletData.filter((data) => data.id === userId); 
    const userHistories = histData.filter((data) => data.id === userId );  

    if (userWallets.length !== 1 || userHistories.length !== 1) {
        alert(`there is another id or no id.`); 
        console.log(`userWallets -> ${userWallets}, userHist-> ${userHistories}`)
        throw new Error(`wallets -> ${userWallets.length}, hists -> ${userHistories.length}, histData -> ${histData}`) 
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
    
    const { data: curPriceData, isLoading: isCurPriceLoading, error: curPriceError } = useQuery({ 
        queryKey: [ 'curPrice', coinId ],
        queryFn: () => {
            // handling nullabe case. 
            if (!coinId) {
                throw new Error('coinId is required'); 
            }
            return fetchCurPrice(coinId)
        },  
        enabled: !!coinId
    }); 
    
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
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
      changeData(userId, type, total, coinId, amount, price); 
      setAmount(0); 
    }

    if (isCurPriceLoading) return <div>Loading..</div>;
    if (curPriceError || (!curPriceData)) return <div>Fail</div>;

    const total = price * amount;

    const TradeForBuy = () => { 
        return (
            <Form>
            <Row>
                <Label>매수가격 (USD)</Label>
                <Input type="number" value={price} />
            </Row>

            <Row>
                <Label>주문수량 (BTC)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Row>

            <PercentButtons>
                {[10, 25, 50, 100].map((percent) => (
                <PercentBtn key={percent} onClick={() => setAmount((percent / 100) * 1)}>{percent}%</PercentBtn>
                ))}
                <PercentBtn>직접입력</PercentBtn>
            </PercentButtons>

            <Row>
                <Label>주문총액 (USD)</Label>
                <div>{total.toLocaleString()} USD</div>
            </Row>

            <StyledBtn onClick={() => changeData(userId, BUY, total, coinId, amount, price)}>매수</StyledBtn>
            </Form>
        );
    }


    const TradeForSell = () => { 
        return (
            <Form>
            <Row>
                <Label>매도가격 (USD)</Label>
                <Input type="number" value={price} />
            </Row>

            <Row>
                <Label>매도수량 (BTC)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Row>

            <Row>
                <Label>주문총액 (USD)</Label>
                <div>{total.toLocaleString()} USD</div>
            </Row>

            <StyledBtn onClick={() => changeData(userId, SELL, total, coinId, amount, price)}>매도</StyledBtn>
            </Form>
        );
    }

  return (
    <Container>
      <TabMenu>
        <Tab active={activeTab === "buy"} onClick={() => setActiveTab("buy")}>매수</Tab>
        <Tab active={activeTab === "sell"} onClick={() => setActiveTab("sell")}>매도</Tab>
      </TabMenu>

      {(activeTab === "buy" && (
        <TradeForBuy />
      )) || (
        activeTab === "sell" && (
        <TradeForSell />
        )
      )
      }
    </Container>
  );
}
