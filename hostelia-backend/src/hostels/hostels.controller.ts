import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { HostelsService } from './hostels.service';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hostels')
export class HostelsController {
  constructor(private readonly hostelsService: HostelsService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.hostelsService.findAllForOwner(user.id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateHostelDto) {
    return this.hostelsService.createForOwner(user, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: any, @Param('id') id: string) {
    return this.hostelsService.findOneForOwner(id, user.id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateHostelDto) {
    return this.hostelsService.updateForOwner(id, user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.hostelsService.removeForOwner(id, user.id);
  }
}
