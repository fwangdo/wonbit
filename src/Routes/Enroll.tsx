import React, { useState, useEffect } from "react"; 
import styled from "styled-components";
import { Col, InputStyle, StyledInputProps, StyledInput, StyledBtn} from "../Components/Member"; 
import { useFormStore, initialState } from "../stores/useFormStore"; 
import { USERS
        , IUser
        , WALLET
        , IWallet
        , HIST, IHistory 
        } from "../Components/Data"; 

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`


function Enroll() {

    const {
        id, pwd, pwd2, name, loc, 
        errors, isValid, 
        updateField, resetForm, validateForm
    } = useFormStore(); 

    const handleChange = (field: keyof Omit<typeof initialState, 'errors' | 'isValid'>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateField(field, e.target.value)
        }

    const handleRegister = () => {
        if (!validateForm()) {
            alert("Please fix the errors before submitting")
            return
        }

        // 기존 localStorage 로직
        const existing = localStorage.getItem(USERS)
        let users: IUser[] = existing ? JSON.parse(existing) : []

        const existingWallet = localStorage.getItem(WALLET)
        let wallets: IWallet[] = existingWallet ? JSON.parse(existingWallet) : []

        const existingHist = localStorage.getItem(HIST)
        let histories: IHistory[] = existingHist ? JSON.parse(existingHist) : []

        if (users.some((user) => user.id === id)) {
            alert(`The id exists.`)
            return
        }

        const newUser = { id, pwd, name, loc }
        const newWallet: IWallet = { "id": id, "usd": 10000, coins: {} }
        const newHist: IHistory = { "id": id, "data": [] }

        users.push(newUser)
        wallets.push(newWallet)
        histories.push(newHist)

        localStorage.setItem(USERS, JSON.stringify(users))
        localStorage.setItem(WALLET, JSON.stringify(wallets))
        localStorage.setItem(HIST, JSON.stringify(histories))

        alert("New account is created.")
        resetForm()
    }

    return (
        <Col> 
            Register
            <div>
                <StyledInput placeholder="Id" value={id} onChange={handleChange("id") } /> 
                {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
            </div>

            <div>
                <StyledInput placeholder="Password" value={pwd} type="password" onChange={handleChange("pwd") } /> 
                {errors.pwd && <ErrorMessage>{errors.pwd}</ErrorMessage>}
            </div>
    
            <div>
                <StyledInput placeholder="Password Check" value={pwd2} type="password" onChange={handleChange("pwd2")} /> 
                {errors.pwd2 && <ErrorMessage>{errors.pwd2}</ErrorMessage>}
            </div> 

            <div>
                <StyledInput placeholder="Name" value={name} onChange={handleChange("name")} /> 
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </div>

            <div>
                <StyledInput placeholder="Location" value={loc} onChange={handleChange("loc") } /> 
                {errors.loc && <ErrorMessage>{errors.loc}</ErrorMessage>}
            </div>

            <div>
                <StyledBtn 
                onClick={handleRegister} 
                disabled={!isValid}
                >Done</StyledBtn>
            </div>
        </Col>
    ); 
}

export default Enroll; 