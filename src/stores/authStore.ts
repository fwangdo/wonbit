import { create } from 'zustand'; 
import { devtools } from 'zustand/middleware'

interface AuthState {
    isLogin: boolean;  
    userId: string | null; 
}

interface AuthActions { 
    login: (userId: string) => void;
    logout: () => void;
    setIsLogin: (isLogin: boolean) => void;
    setUserId: (userId: string | null) => void;
}

type AuthStore = AuthState & AuthActions; 

export const useAuthStore = create<AuthStore>()( 
    devtools(
        (set) => ({
            // State
            isLogin: false, 
            userId: null, 

            // Actions. 
            login: (userId: string) =>
                set({ isLogin: true, userId }, false, 'login'), 

            logout: () => 
                set({ isLogin: false, userId: null}, false, 'logout'), 

            setIsLogin: (isLogin: boolean) =>
                set({ isLogin }, false, 'setIsLogin'), 

            setUserId: (userId: string | null) => 
                set({ userId }, false, 'setUserId')
        }), 
        { name: 'auth-store' }
    )
);