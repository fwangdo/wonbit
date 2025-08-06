import { isLoginState } from "../atoms/Atom";
import { useRecoilState } from "recoil";  
import { useNavigate, Link } from "react-router-dom";
import { StyledBtn } from "../Components/Member";
import styled from "styled-components"; 

const MiddleDiv = styled.div`
    display: flex;
    justify-content: center;
    height: 200vh;
`

function Wallet() {

    const [isLogin, setIsLogin ] = useRecoilState(isLoginState); 
    const navigate = useNavigate(); 

    const moveToLogin = () => {
        navigate("/login"); 
    }

    return (
        <MiddleDiv> 
            {isLogin ? (
                <div>Hello</div>
                ) : (
                <StyledBtn onClick={moveToLogin} >Login</StyledBtn>
            )}
        </MiddleDiv>
    ); 
}

export default Wallet; 