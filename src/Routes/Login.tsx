import styled from "styled-components";
import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 
import { USERS, IUser } from "../Components/Data"; 
import { isLoginState } from "../atoms/Atom"; 
import {
    useRecoilState
} from "recoil"; 


function Login() {

    const [id, setId] = useState(""); 
    const [pwd, setPwd ]  = useState(""); 

    const [isLogin, setIsLogin] = useRecoilState(isLoginState); 
    const navigate = useNavigate(); 

    function genCatchFunc(elem: React.Dispatch<React.SetStateAction<string>>) {
        function catchFunc(e: React.ChangeEvent<HTMLInputElement>) { 
            e.preventDefault(); 
            elem(e.target.value); 
        };
        return catchFunc; 
    }

    const changeId = genCatchFunc(setId);
    const changePwd = genCatchFunc(setPwd); 

    const reinitState = () => {
        setId(""); 
        setPwd(""); 
    }

    const handleLogin = () => {
        const existing = localStorage.getItem(USERS); 
        let users = existing ? JSON.parse(existing) : []; 

        // some => boolean. 
        const found = users.some((user: IUser) => user.id === id && user.pwd === pwd); 
        if (!found) {
            alert("There is no account.");
            return; 
        }

        // TODO: change status 
        setIsLogin(true);

        // initializing. 
        reinitState(); 
    }; 
    
    return (
        <Col>
            {   isLogin ? (
                <div>Done</div>
                ) : (
                <>
                Log in
                <StyledInput value={id} onChange={changeId} placeholder="Id" marginTop="80px" />
                <StyledInput value={pwd} onChange={changePwd} placeholder="Password" marginTop="5px"/>
                <StyledBtn onClick={handleLogin}>Login</StyledBtn>
                </>
                )
            }
        </Col>
    ); 
}

export default Login; 