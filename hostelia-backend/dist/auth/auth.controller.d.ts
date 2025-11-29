import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    signin(dto: SigninDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    profile(user: any): any;
}
