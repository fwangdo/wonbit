import React from "react"; 
import { styled } from 'styled-components';
import { Link, useMatch, useLocation } from 'react-router-dom'; 
import wonbit from '../Assets/wonbit.jpeg'; 
import { useRecoilState } from "recoil"; 
import { isLoginState } from '../atoms/Atom'; 
import { BlueColor } from './CommonColor';
import { theme } from '../theme'; 


interface IItemProps extends React.LiHTMLAttributes<HTMLElement>{
    color?: string;
    children: React.ReactNode; 
}

function Item( { color = theme.white.lighter, children, ...props }: IItemProps) {
    return (
        <li
            {...props}
            className="mr-[30px] transition-colors duration-300 ease-in-out relative flex justify-center flex-col"
            style={{color}}
        >
            {children}
        </li>
    ); 
}

function StyledLink({children, to, ...props}: { children: React.ReactNode, to: string }) {
    return (
        <Link
            {...props}
            to={to}
            className={`
                no-underline
                transition-colors duration-300 ease-in-out
                hover:[color:${theme.black.lighter}]
                visited:[color:${theme.white.lighter}]
            `}
            style={{color: theme.white.lighter}}
        >
            {children}
        </Link>
    )
}

function Bold( { children }: { children: React.ReactNode }) {
    return (
        <span className={`
            text-[${theme.white.lighter}]          
            font-bold
        `}
        >
            {children}
        </span>
    )
}; 

function Img({...props}) {
    return ( 
        <img
            {...props}
            className={`w-[90px] mr-[30px]`}
        />
    )
}

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