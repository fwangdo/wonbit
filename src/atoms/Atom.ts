import { atom } from "recoil"; 

export const isLoginState = atom<boolean>({
    key: 'isLogin', 
    default: false
})

export const userIdState = atom<string | null>({
    key: 'id', 
    default: null
})