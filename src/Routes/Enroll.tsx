import React, { useState, useEffect } from "react"; 
import styled from "styled-components";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 
import { USERS
        , IUser
        , WALLET
        , IWallet
        } from "../Components/Data"; 


function Enroll() {

    const [ id, setId ] = useState(""); 
    const [ pwd, setPwd ] = useState(""); 
    const [ pwd2, setPwd2 ] = useState(""); 
    const [ name, setName ] = useState(""); 
    const [ loc, setLoc ] = useState(""); 

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

    const reinitState = () => {
        setId("");
        setPwd(""); 
        setPwd2(""); 
        setName(""); 
        setLoc(""); 
    };

    const handleError = () => {
        // 1. check length. 
        if (
            id.length < 2 ||
            pwd.length < 2 ||
            pwd2.length < 2 ||
            name.length < 2 ||
            loc.length < 2 
        ) {
            alert(`All inputs should be more than eqaul to 2 letters.`); 
            return; 
        }

        // 2. check password equivalence. 
        if ( pwd !== pwd2 ) {
            alert(`Password is not equivalent. Check password. `); 
            return; 
        }

        // 3. Get existing info from localStorage
        const existing = localStorage.getItem(USERS); 
        let users: IUser[] = existing ? JSON.parse(existing) : [];

        // 3.1 Get exisitng 
        const existingWallet = localStorage.getItem(WALLET);  
        let wallets: IWallet[] = existingWallet ? JSON.parse(existingWallet) : []; 

        // 4. Check redundant account. 
        if (users.some((user) => user.id === id)) {
            alert(`The id exists.`); 
            return; 
        }
        
        return { users, wallets };
    }
    
    const handleRegister = () => {
        const storages = handleError();  
        if (!storages) return;  
        const { users, wallets } = storages; 

        const newUser = { id, pwd, name, loc };
        const newWallet: IWallet = { "id": id, "usd": 0, coins: {} };

        users.push(newUser); 
        wallets.push(newWallet); 

        localStorage.setItem(USERS, JSON.stringify(users)); 
        localStorage.setItem(WALLET, JSON.stringify(wallets)); 

        alert("New account is created.")
        reinitState();  
    }; 

    return (
        <Col> 
            Register
            <StyledInput placeholder="Id" value={id} onChange={changeId } /> 
            <StyledInput placeholder="Password" value={pwd} onChange={changePwd } /> 
            <StyledInput placeholder="Password Check" value={pwd2} onChange={changePwd2 } /> 
            <StyledInput placeholder="Name" value={name} onChange={ changeName } /> 
            <StyledInput placeholder="Location" value={loc} onChange={changeLoc } /> 
            <StyledBtn onClick={handleRegister} >Done</StyledBtn>
        </Col>
    ); 
}

export default Enroll; 