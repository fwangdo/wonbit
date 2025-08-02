import { useState } from 'react';
import { styled } from 'styled-components';
import { Link, useMatch } from 'react-router-dom'; 

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
    background-color: blue;
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


function Header() {
    const homeMatch = useMatch('/'); 
    const walletMatch = useMatch('/wallet'); 
    const histMatch = useMatch('/history');  
    const supportMatch = useMatch('/support'); 

    return (
        <>
        <Col>
            <Items>
                <Item><StyledLink to="/">{ homeMatch ? <Bold>Home</Bold> : "Home" }</StyledLink></Item>
                <Item><StyledLink to="/wallet">{ walletMatch ? <Bold>Wallet</Bold> : "Wallet" }</StyledLink></Item>
                <Item><StyledLink to="/history">{ histMatch ? <Bold>History</Bold> : "History" }</StyledLink></Item>
                <Item><StyledLink to="/support">{ supportMatch ? <Bold>Support</Bold> : "Support" }</StyledLink></Item>
            </Items>

            <Items>
                <Item>Login</Item>
                <Item>Enroll</Item>
            </Items>
        </Col>
        </>
    ); 
}; 

export default Header;  