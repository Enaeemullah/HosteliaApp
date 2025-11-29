import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeeStatus } from '../../common/enums/fee-status.enum';

export class UpdateFeeDto {
  @IsEnum(FeeStatus)
  status: FeeStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
