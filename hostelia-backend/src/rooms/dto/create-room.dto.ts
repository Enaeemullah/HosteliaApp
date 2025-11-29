import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsNotEmpty()
  roomNumber: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity: number;
}
