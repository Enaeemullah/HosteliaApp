import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHostelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  description?: string;
}
