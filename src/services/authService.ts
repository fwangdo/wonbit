import { StorageService } from './storageService';
import { IUser } from '../Components/Data';
import { AppError } from '../errors/AppErrors';

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export class AuthService {
  static async login(request: LoginRequest): Promise<LoginResult> {
    try {
      const { id, password } = request;
      const users = StorageService.getUsers();
      
      const user = users.find((u) => u.id === id && u.pwd === password);
      
      if (!user) {
        return {
          success: false,
          error: '아이디 또는 비밀번호가 잘못되었습니다.'
        };
      }
      
      return {
        success: true,
        userId: user.id
      };
      
    } catch (error) {
      return {
        success: false,
        error: '로그인 처리 중 오류가 발생했습니다.'
      };
    }
  }

  static validateLoginRequest(request: LoginRequest): void {
    const { id, password } = request;
    
    if (!id || id.trim() === '') {
      throw new AppError(
        'User ID is required',
        'INVALID_USER_ID',
        '아이디를 입력해주세요.',
        false
      );
    }
    
    if (!password || password.trim() === '') {
      throw new AppError(
        'Password is required',
        'INVALID_PASSWORD',
        '비밀번호를 입력해주세요.',
        false
      );
    }
  }
}