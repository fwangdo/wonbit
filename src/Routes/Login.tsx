import styled from "styled-components";
import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";

const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* 가로 중앙 정렬 */
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;
    margin-top: 150px;
    font-size: 50px;
`;


const InputStyle = {
    width: "500px",   // 가로 크기 조절
    height: "40px",   // 세로 크기 조절
    fontSize: "16px", // 글자 크기 조절 (선택 사항)
    padding: "8px", 
}

interface StyledInputProps {
    marginTop?: string;
}

const StyledInput = styled.input.withConfig({
    shouldForwardProp: (prop) => prop !== "marginTop" // do not forward to html. 
})<StyledInputProps>`
    width: 500px;   // 가로 크기 조절
    height: 40px;   // 세로 크기 조절
    padding: 8px; 
    font-size: 16px;
    margin-top: ${(props) => props.marginTop || "20px" };
    border-radius: 10px;
    border-width: 1px;
`

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
            <button style={{ marginTop: "30px", ...InputStyle }} onClick={() => navigate("/")}>Login</button>
        </Col>
    ); 
}

export default Login; 