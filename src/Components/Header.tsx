import { useState } from 'react';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom'; 

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
`;

const Items = styled.ul`
    display: flex;
    align-items: center; 
    margin-right: 600px;
`; 

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.black.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.black.lighter};
  }
`; 


function Header( { children }: IChildren) {
    return (
        <>
        <Col>
            <Items>
                <Item>홈</Item>
                <Item>거래소</Item>
                <Item>입출금</Item>
                <Item>거래내역</Item>
                <Item>고객센터</Item>
            </Items>

            <Items>
                <Item>로그인</Item>
                <Item>회원가입</Item>
            </Items>
        </Col>
        </>
    ); 
}; 

export default Header;  