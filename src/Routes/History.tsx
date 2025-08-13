import { useRecoilValue } from "recoil"; 
import { isLoginState, userIdState } from "../atoms/Atom";
import { useNavigate, useParams } from "react-router-dom";
import { StyledBtn } from "../Components/Member";
import styled from "styled-components"; 
import { IHistory, HIST, BUY, SELL, TransType } from "../Components/Data";
import { checkData } from "../Components/CheckData"; 

interface IReactContainer {
    children?: React.ReactNode
}

function MiddleDiv({children}: IReactContainer) {
    return (
        <div className={`
            flex
            flex-col
            items-center
            h-[200vh]
            gap-[30px]
            p-[30px]
            `}>{children}</div>
    )
} 

function UserIdDiv({ children }: IReactContainer) {
    return <div className="text-[30px]">{children}</div>
}

function HistList({ children }: IReactContainer) {
    return <div className="pl-0 list-none">{children}</div>
}

function Hist({children}: IReactContainer) {
    return (
        <li className={`
            flex
            list-none
            bg-[white]
            text-[#2f3640]
            rounded-[15px]
            mb-[10px]
            text-[20px]
            w-[50vw]
            h-[40px]
            items-center
            pl-[20px] 
            `}>{children}</li>
    )
}

const StyledSpan = styled.span`
    margin-right: 10px;
`

interface TranTypeSpanProps {
  $transType: TransType 
}

const TranTypeSpan = styled(StyledSpan)<TranTypeSpanProps>`   
    color: ${({ $transType}) => ( $transType === SELL ? "blue" : "red")}; 
`

function TranTypeDiv({ children, transType }: IReactContainer & { transType: string }) {
    const colorClass = transType === SELL ? "text-blue-600" : "text-red-600"; 

    return (
        <div className={`
            w-[50px]
            p-[10px]
            ${colorClass}
        `}>
            {children}
        </div>
    )
}

function DateDiv( {children}: IReactContainer ) {
    return (
        <div className={`
            w-[230px]
            p-[10px]
        `}>
            {children}
        </div>
    )
}

function CoinDiv( {children}: IReactContainer ) {
    return (
        <div className={`
            w-[100px]
            p-[10px]
        `}>
            {children}
        </div>
    )
}

function PriceDiv( {children}: IReactContainer ) {
    return (
        <div className={`
            w-[50px]
            p-[10px]
        `}>
            {children}
        </div>
    )
}

function AmountDiv( {children}: IReactContainer ) {
    return (
        <div className={`
            w-[50px]
            p-[10px]
        `}>
            {children}
        </div>
    )
}

// transition to kst. 
interface ITimeProp {
    year: string;    
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
}

const formatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function dateToTime(date: number): string {
    const parts = formatter.formatToParts(date);
    const dateTimeObj: Partial<ITimeProp> = {};
    parts.forEach(({ type, value }) => {
        dateTimeObj[type as keyof ITimeProp] = value;
    });
    const res = `${dateTimeObj.year}-${dateTimeObj.month}-${dateTimeObj.day} ${dateTimeObj.hour}:${dateTimeObj.minute}:${dateTimeObj.second}`;
    return res; 
}


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
        <>
            <UserIdDiv>{`${userId}'s history`}</UserIdDiv>
            <HistList>
                {userHistory.data.slice().reverse().map(({date, type, coin, amount, price}, idx) => (
                    <Hist key={date}>
                        <DateDiv>{dateToTime(date)}</DateDiv>
                        <TranTypeDiv transType={type}>{type}</TranTypeDiv>
                        <CoinDiv>{coin}</CoinDiv>
                        <AmountDiv>{amount}</AmountDiv> 
                        <PriceDiv>{price}</PriceDiv>
                    </Hist>
                ))}
            </HistList>
        </>
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