import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  name?: string;

  @IsNotEmpty()
  hostelName: string;

  @IsNotEmpty()
  hostelAddress: string;
}
