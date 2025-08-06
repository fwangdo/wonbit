import styled from "styled-components";
import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 
import { USERS, IUser } from "../Components/Data"; 


function Login() {

    const [id, setId] = useState(""); 
    const [pwd, setPwd ]  = useState(""); 
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
        
        // checking.
        // if (users.filter((user: IUser) => user.id === id && user.pwd === pwd).length === 0) {
        //     alert("There is no account.")
        //     return; 
        // }

        // better way. 
        const found = users.some((user: IUser) => user.id === id && user.pwd === pwd); 
        if (!found) {
            alert("There is no account.");
            return; 
        }

        // TODO: change status 

        // initializing. 
        reinitState(); 
    }; 
    
    return (
        <Col>
            Log in
            <StyledInput value={id} onChange={changeId} placeholder="Email" marginTop="80px" />
            <StyledInput value={pwd} onChange={changePwd} placeholder="Password" marginTop="5px"/>
            <StyledBtn onClick={handleLogin}>Login</StyledBtn>
        </Col>
    ); 
}

export default Login; 