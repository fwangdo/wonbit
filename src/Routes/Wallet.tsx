import { isLoginState, userIdState } from "../atoms/Atom";
import { useRecoilState, useRecoilValue } from "recoil";  
import { useNavigate } from "react-router-dom";
import { StyledBtn } from "../Components/Member";
// import styled from "styled-components"; 
import { IWallet, WALLET } from "../Components/Data";

// const MiddleDiv = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     height: 200vh;
//     gap: 30px;
//     padding: 30px; 
// `

interface IReactProps {
    children?: React.ReactNode;
}

function MiddleDiv({ children }: IReactProps) {
    return (
        <div className={`
            flex
            flex-col
            items-center
            h-[200vh]
            gap-[30px]
            p-[30px]
        `}>
            {children}
        </div>
    )
}

// const UserIdDiv = styled.div`
//     font-size: 30px ;
// `

function UserIdDiv({children}: IReactProps) {
    return (
    <div className={`
        text-[30px]
    `}>
        {children}
    </div>
    ) 
}

// const CoinsList = styled.ul`
//   list-style: none;
//   padding-left: 0;
//   margin: 0;
// `;

function CoinsList({ children }: IReactProps) {
    return (
        <div className={`
            list-none
            pl-0
            m-0
        `}>
            {children}
        </div>
    )
}

// const Coin = styled.li`
//     display: flex;
//     list-style: none;
//     background-color: white;
//     color: #2f3640;   
//     border-radius: 15px;
//     margin-bottom: 10px;
//     font-size: 20px;
//     width: 500px;
//     height: 40px;
//     align-items: center;
//     padding: 0 0 0 20px; 
// `

function Coin({ children }: IReactProps) {
    return (<div className={`
        flex
        list-none
        bg-white
        color-[#2f3640]
        rounded-[15px]
        mb-[10px]
        text-[20px]
        w-[500px]
        h-[40px]
        items-center
        pl-[20px]
    `}>
        {children}
    </div>)
}

function UserWallet ({userId}: {userId: string | null}) {
    if (!userId) {
        alert(`${userId} does not exist. `)
        throw new Error(`${userId} does not exist.`)
    } 
    
    const existingWallet = localStorage.getItem(WALLET); 
    if (!existingWallet) {
        alert(`there is no wallet`);
        throw new Error (`there is no wallet. `)
    }

    const tempUserWallets: IWallet[] = JSON.parse(existingWallet); 
    const userWallets = tempUserWallets.filter((wallet) => wallet.id === userId);  
    
    if (userWallets.length !== 1) {
        alert(`there is no wallet about ${userId}`); 
        throw new Error(`there is no wallet about ${userId}`); 
    }

    const userWallet = userWallets[0]; 

    return (
        <>
        <UserIdDiv>
            {`${userWallet.id}'s Wallet`}
        </UserIdDiv>
        <CoinsList>
            <Coin key="usd">{`usd: ${userWallet.usd.toFixed(3)}`}</Coin>
        {Object.entries(userWallet.coins).map(([coin, amount], idx) => (
            <Coin key={coin}>
                {`${coin}: ${amount.toFixed(3)}`}
            </Coin>
        ))
        }
        </CoinsList>
        </>
    ); 
}

function Wallet() {

    const [isLogin, setIsLogin ] = useRecoilState(isLoginState); 
    const userId = useRecoilValue(userIdState) 
    const navigate = useNavigate(); 

    const moveToLogin = () => {
        navigate("/login"); 
    }

    return (
        <MiddleDiv> 
            {isLogin ? (
                <UserWallet userId={userId}/> 
                ) : (
                <StyledBtn onClick={moveToLogin} >Login</StyledBtn>
            )}
        </MiddleDiv>
    ); 
}

export default Wallet; 