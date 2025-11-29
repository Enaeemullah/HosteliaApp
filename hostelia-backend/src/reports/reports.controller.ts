import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hostels/:hostelId')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: any, @Param('hostelId') hostelId: string) {
    return this.reportsService.getDashboard(user.id, hostelId);
  }

  @Get('reports/:format')
  export(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('format') format: 'csv' | 'excel' | 'pdf',
  ) {
    return this.reportsService.export(user.id, hostelId, format);
  }
}
