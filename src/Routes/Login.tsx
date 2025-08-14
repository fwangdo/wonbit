import { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Col, StyledInput, StyledBtn} from "../Components/Member"; 
import { USERS, IUser } from "../Components/Data"; 
import { isLoginState, userIdState } from "../atoms/Atom"; 
import {
    useRecoilState
} from "recoil"; 
import { UserNotFoundError } from '../errors/AppErrors';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorToast } from '../errors/ErrorHandler';


function Login() {

    const [id, setId] = useState(""); 
    const [pwd, setPwd ]  = useState(""); 

    const [isLogin, setIsLogin] = useRecoilState(isLoginState); 
    const [userId, setUserId ] = useRecoilState(userIdState); 
    const navigate = useNavigate(); 

    const { error, handleError, clearError } = useErrorHandler(); 

    useEffect(() => {
        if (isLogin) {
            navigate("/"); 
        }
    }, [isLogin, navigate])

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
        try {
            const existing = localStorage.getItem(USERS); 
            let users = existing ? JSON.parse(existing) : []; 

            // some => boolean. 
            const found = users.some((user: IUser) => user.id === id && user.pwd === pwd); 
            if (!found) {
                throw new UserNotFoundError(id); 
            }

            // change status 
            setIsLogin(true);
            setUserId(id); 

            // initializing. 
            reinitState(); 
        } catch (err) {
            handleError(err); 
            alert(error?.userMessage)
        }
    }; 

    const handleRetry = () => {
        handleLogin();
    };
    
    return (
        <Col>
            {!isLogin && ( 
                <>
                Log in
                <StyledInput value={id} onChange={changeId} placeholder="Id" />
                <StyledInput value={pwd} type="password" onChange={changePwd} placeholder="Password" />
                <div>
                    <StyledBtn onClick={handleLogin}>Login</StyledBtn>
                </div>
                </>
                )
            }
        </Col>
    ); 
}

export default Login; 