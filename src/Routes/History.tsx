import { useRecoilValue } from "recoil"; 
import { isLoginState, userIdState } from "../atoms/Atom";
import { useNavigate, useParams } from "react-router-dom";
import { StyledBtn } from "../Components/Member";
import styled from "styled-components"; 
import { IHistory, HIST } from "../Components/Data";
import { checkData } from "../Components/CheckData"; 

const MiddleDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 200vh;
    gap: 30px;
    padding: 30px; 
`

const UserIdDiv = styled.div`
    font-size: 30px ;
`

const HistList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

const Hist = styled.li`
    display: flex;
    list-style: none;
    background-color: white;
    color: #2f3640;   
    border-radius: 15px;
    margin-bottom: 10px;
    font-size: 20px;
    width: 500px;
    height: 40px;
    align-items: center;
    padding: 0 0 0 20px; 
`

const TranTypeSpan = styled.span`
`

const DateSpan = styled.span`
`

const CoinSpan = styled.span`
`

const UsdSpan = styled.span`
`

const PriceSpan = styled.span`
`

const AmountSpan = styled.span`
`

function HistoryList() {
    const userId: string = checkData(useRecoilValue(userIdState));  
    
    const tempHistories = checkData(localStorage.getItem(HIST));
    const Histories: IHistory[] = JSON.parse(tempHistories); 

    const filteredHistories = Histories.filter((hist) => hist.id === userId); 
    if (filteredHistories.length !== 1) {
        alert(`Error: user id -> ${userId}, element which satisfies the condition -> ${filteredHistories.length}`); 
        throw new Error(`History error `); 
    }

    const userHistory = filteredHistories[0]; 

    return (
        <UserIdDiv>{`${userId}'s history`}</UserIdDiv>
        // <HistList>
        //     {Object.entries(userHistory.data).map(([data, type, coin, amount, price]) => (
        //         <Hist></Hist>
        //     ))}
        // </HistList>
    ); 
}; 


function History() {
    const navigate = useNavigate(); 
    const isLogin = useRecoilValue(isLoginState); 

    return (
        <MiddleDiv>
        {isLogin ? (
            <HistoryList />
        ) : (
            <StyledBtn onClick={() => navigate("/login")}>Login</StyledBtn>
        )}
        </MiddleDiv>
    ); 
}

export default History; 