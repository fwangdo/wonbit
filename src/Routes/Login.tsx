import styled from "styled-components";
import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 


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
    
    return (
        <Col>
            Log in
            <StyledInput onChange={changeId} placeholder="Email" marginTop="80px" />
            <StyledInput onChange={changePwd} placeholder="Password" marginTop="5px"/>
            <StyledBtn onClick={() => navigate("/")}>Login</StyledBtn>
        </Col>
    ); 
}

export default Login; 