import styled from "styled-components";  
import React from "react"; 

// export const Col = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center; /* 가로 중앙 정렬 */
//     width: 100%;
//     margin: 0;
//     padding: 0;
//     height: 100%;
//     margin-top: 150px;
//     font-size: 50px;
// `;

export function Col( { children } : { children: React.ReactNode} ) {
    return (
        <div className="flex flex-col align-center justify-center w-full m-0 p-0 h-1 mt=[150px] text-[50px]">
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

export interface StyledInputProps {
    marginTop?: string;
}

export const StyledInput = styled.input.withConfig({
    shouldForwardProp: (prop) => prop !== "marginTop" // do not forward to html. 
})<StyledInputProps>`
    width: 500px;   // 가로 크기 조절
    height: 30px;   // 세로 크기 조절
    padding: 8px; 
    font-size: 16px;
    margin-top: ${(props) => props.marginTop || "15px" };
    border-radius: 10px;
    border-width: 1px;
`

export const StyledBtn = styled.button`
    width: 500px;
    height: 40px; 
    font-size: 16px;
    padding: 8px;
    margin-top: 30px;
    background-color: #3748cf;
    color: white;
    border-radius: 10px;
    border-width: 1px;
    cursor: pointer;
`