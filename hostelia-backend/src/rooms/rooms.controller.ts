import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hostels/:hostelId/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  list(@CurrentUser() user: any, @Param('hostelId') hostelId: string) {
    return this.roomsService.findAll(user.id, hostelId);
  }

  @Post()
  create(@CurrentUser() user: any, @Param('hostelId') hostelId: string, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(user.id, hostelId, dto);
  }

  @Get(':roomId')
  get(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomsService.get(user.id, hostelId, roomId);
  }

  @Patch(':roomId')
  update(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(user.id, hostelId, roomId, dto);
  }

  @Delete(':roomId')
  remove(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomsService.remove(user.id, hostelId, roomId);
  }
}
