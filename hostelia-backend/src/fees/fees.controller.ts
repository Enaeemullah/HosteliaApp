import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('hostels/:hostelId/fees')
  list(@CurrentUser() user: any, @Param('hostelId') hostelId: string) {
    return this.feesService.list(user.id, hostelId);
  }

  @Post('hostels/:hostelId/students/:studentId/fees')
  create(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('studentId') studentId: string,
    @Body() dto: CreateFeeDto,
  ) {
    return this.feesService.create(user.id, hostelId, studentId, dto);
  }

  @Patch('hostels/:hostelId/fees/:feeId')
  update(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('feeId') feeId: string,
    @Body() dto: UpdateFeeDto,
  ) {
    return this.feesService.updateStatus(user.id, hostelId, feeId, dto);
  }

  @Get('hostels/:hostelId/fees/:feeId/receipt')
  receipt(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('feeId') feeId: string,
  ) {
    return this.feesService.getReceipt(user.id, hostelId, feeId);
  }
}
