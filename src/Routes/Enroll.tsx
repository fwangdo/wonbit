import React, { useState, useEffect } from "react"; 
import styled from "styled-components";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 

function Enroll() {

    const [ Id, setId ] = useState(""); 
    const [ Pwd, setPwd ] = useState(""); 
    const [ Pwd2, setPwd2 ] = useState(""); 
    const [ Name, setName ] = useState(""); 
    const [ Loc, setLoc ] = useState(""); 

    const [ done, setDone ] = useState(false); 

    function genCatchFunc(elem: React.Dispatch<React.SetStateAction<string>>) {
        function catchFunc(e: React.ChangeEvent<HTMLInputElement>) { 
            e.preventDefault(); 
            elem(e.target.value); 
        };
        return catchFunc; 
    }

    const changeId = genCatchFunc(setId); 
    const changePwd = genCatchFunc(setPwd); 
    const changePwd2 = genCatchFunc(setPwd2); 
    const changeName = genCatchFunc(setName); 
    const changeLoc = genCatchFunc(setLoc); 

    return (
        <Col> 
            Register
            <StyledInput placeholder="Id" /> 
            <StyledInput placeholder="Password" /> 
            <StyledInput placeholder="Password Check" /> 
            <StyledInput placeholder="Name" /> 
            <StyledInput placeholder="Location" /> 
            <StyledBtn>Done</StyledBtn>
        </Col>
    ); 
}

export default Enroll; 