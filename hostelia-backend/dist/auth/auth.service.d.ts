import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { HostelsService } from '../hostels/hostels.service';
export declare class AuthService {
    private readonly usersService;
    private readonly hostelsService;
    private readonly jwtService;
    constructor(usersService: UsersService, hostelsService: HostelsService, jwtService: JwtService);
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
    private buildAuthResponse;
}
