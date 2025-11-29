import { IsEnum, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { FeeStatus } from '../../common/enums/fee-status.enum';

export class CreateFeeDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  dueDate: string;

  @IsOptional()
  @IsEnum(FeeStatus)
  status?: FeeStatus;
}
