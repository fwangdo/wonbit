import React, { useState } from "react";
import styled from "styled-components";

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

const Tab = styled.div<ITabProp>`
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

const AuthBtn = styled.button`
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

export function TradePanel() {
  const [activeTab, setActiveTab] = useState("buy");
  const [price, setPrice] = useState(160683000);
  const [amount, setAmount] = useState(0);

  const total = price * amount;

  return (
    <Container>
      <TabMenu>
        <Tab active={activeTab === "buy"} onClick={() => setActiveTab("buy")}>매수</Tab>
        <Tab active={activeTab === "sell"} onClick={() => setActiveTab("sell")}>매도</Tab>
        {/* <Tab active={activeTab === "simple"} onClick={() => setActiveTab("simple")}>간편주문</Tab>
        <Tab active={activeTab === "history"} onClick={() => setActiveTab("history")}>거래내역</Tab> */}
      </TabMenu>

      {(activeTab === "buy" && (
        <Form>
          <Row>
            <Label>매수가격 (KRW)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
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
            <Label>주문총액 (KRW)</Label>
            <div>{total.toLocaleString()} KRW</div>
          </Row>

          {/* <AuthButtons>
            <AuthBtn>회원가입</AuthBtn>
            <AuthBtn>로그인</AuthBtn>
          </AuthButtons> */}
        </Form>
      )) || (
        activeTab === "sell" && (
            null    
        )
      )
      }
    </Container>
  );
}
