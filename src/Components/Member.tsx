import styled from "styled-components";  
import React from "react"; 


export function Col( { children } : { children: React.ReactNode} ) {
    return (
        <div className="flex flex-col align-center justify-center w-full m-0 p-0 h-1 mt-[150px] text-[50px]">
            {children}
        </div>
    )
}

export const InputStyle = {
    width: "500px",   // 가로 크기 조절
    height: "40px",   // 세로 크기 조절
    fontSize: "16px", // 글자 크기 조절 (선택 사항)
    padding: "8px", 
}


export interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    marginTop?: string
}

export function StyledInput({ marginTop = "15px", ...props }: StyledInputProps) {
    return (
        <input 
            {...props}
            className={`w-[500px] h-[30px] p-2 text-[16px] rounded-[10px] border border-solid`}
            style={{marginTop}}
        />
    )
}


export function StyledBtn({...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button 
            {...props}
            className={`w-[500px] h-[40px] text-[16px] p-[8px] mt-[10px] bg-color-[#3748cf] text-white border rounded-[10px] cursor-pointer`}
        />
    )
};