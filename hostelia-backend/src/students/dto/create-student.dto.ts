import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  rollNumber: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  roomId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyFee: number;
}
