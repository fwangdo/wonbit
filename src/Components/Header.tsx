import { styled } from 'styled-components';
import { Link, useMatch, useLocation } from 'react-router-dom'; 
import wonbit from '../Assets/wonbit.jpeg'; 
import { useRecoilState } from "recoil"; 
import { isLoginState } from '../atoms/Atom'; 
import { BlueColor } from './CommonColor';


const Item = styled.li`
  margin-right: 30px;
  color: ${(props) => props.theme.white.lighter};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
`; 

// function Item = 

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.white.lighter};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.black.lighter};
  }

  &:visited {
    color: ${(props) => props.theme.white.lighter};
  }
`; 


const Bold = styled.span`
    color: ${(props) => props.theme.white.lighter};
    font-weight: bold;
`

export const Img = styled.img`
    width: 90px;
    margin-right: 30px;
`


function Header() {
    const homeMatch = useMatch('/'); 
    const walletMatch = useMatch('/wallet'); 
    const marketMatch = useLocation().pathname.startsWith("/market");  
    const histMatch = useMatch('/history');  

    // login and enroll. 
    const loginMatch = useMatch('/login')
    const enrollMatch = useMatch('/enroll')

    // recoil state
    const [isLogin, setIsLogin] = useRecoilState(isLoginState); 

    const execLogout = () => {
        setIsLogin(false); 
    };

    return (
        <div className={`flex w-full h-[5vh] m-0 p-0 justify-between items-center bg-[${BlueColor}] px-[15vw]`}>
            <ul className='flex'>
                <Img src={wonbit}/>
                <Item><StyledLink to="/">{ homeMatch ? <Bold>Home</Bold> : "Home" }</StyledLink></Item>
                <Item><StyledLink to="/market">{ marketMatch ? <Bold>Market</Bold> : "Market" }</StyledLink></Item>
                <Item><StyledLink to="/wallet">{ walletMatch ? <Bold>Wallet</Bold> : "Wallet" }</StyledLink></Item>
                <Item><StyledLink to="/history">{ histMatch ? <Bold>History</Bold> : "History" }</StyledLink></Item>
            </ul>

            <ul className='flex'>
                { isLogin ? (
                    <Item onClick={execLogout}><StyledLink to="/">Logout</StyledLink></Item>
                ): (
                    <Item><StyledLink to="/login">{ loginMatch ? <Bold>Login</Bold> : "Login" }</StyledLink></Item>
                )
                } 
                <Item><StyledLink to="/enroll">{ enrollMatch ? <Bold>Enroll</Bold> : "Enroll" }</StyledLink></Item>
            </ul>
        </div>
    ); 
}; 

export default Header;  