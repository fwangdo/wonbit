import { useState } from 'react';
import { styled } from 'styled-components';
import { Link, useMatch, useLocation } from 'react-router-dom'; 
import wonbit from '../Assets/wonbit.jpeg'; 

interface IChildren {
    children: string 
}

const Col = styled.div`
    display: flex;
    align-items: center;
    justify-content: center; /* 가로 중앙 정렬 */
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #3356b0;
`;

const Items = styled.ul`
    display: flex;
    align-items: center; 
    margin-right: 100px;
`; 

const Item = styled.li`
  margin-right: 30px;
  color: ${(props) => props.theme.white.lighter};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
`; 

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
    // const marketMatch = useMatch('/market'); 
    const walletMatch = useMatch('/wallet'); 
    const marketMatch = useLocation().pathname.startsWith("/market");  
    const histMatch = useMatch('/history');  

    // login and enroll. 
    const loginMatch = useMatch('/login')
    const enrollMatch = useMatch('/enroll')

    return (
        <>
        <Col>
            <Items>
                <Img src={wonbit}/>
                <Item><StyledLink to="/">{ homeMatch ? <Bold>Home</Bold> : "Home" }</StyledLink></Item>
                <Item><StyledLink to="/market">{ marketMatch ? <Bold>Market</Bold> : "Market" }</StyledLink></Item>
                <Item><StyledLink to="/wallet">{ walletMatch ? <Bold>Wallet</Bold> : "Wallet" }</StyledLink></Item>
                <Item><StyledLink to="/history">{ histMatch ? <Bold>History</Bold> : "History" }</StyledLink></Item>
            </Items>

            <Items>
                <Item><StyledLink to="/login">{ loginMatch ? <Bold>Login</Bold> : "Login" }</StyledLink></Item>
                <Item><StyledLink to="/enroll">{ enrollMatch ? <Bold>Enroll</Bold> : "Enroll" }</StyledLink></Item>
            </Items>
        </Col>
        </>
    ); 
}; 

export default Header;  