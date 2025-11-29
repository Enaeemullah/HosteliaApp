import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHostelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Logo must be a valid URL' })
  logoUrl?: string;
}
