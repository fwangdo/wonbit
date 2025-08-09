import { isLoginState, userIdState } from "../atoms/Atom";
import { useRecoilState, useRecoilValue } from "recoil";  
import { useNavigate, Link } from "react-router-dom";
import { StyledBtn } from "../Components/Member";
import styled from "styled-components"; 
import { IWallet, WALLET } from "../Components/Data";

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

const CoinsList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;


const Coin = styled.li`
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