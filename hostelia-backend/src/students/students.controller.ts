import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hostels/:hostelId/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  list(@CurrentUser() user: any, @Param('hostelId') hostelId: string) {
    return this.studentsService.findAll(user.id, hostelId);
  }

  @Post()
  create(@CurrentUser() user: any, @Param('hostelId') hostelId: string, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user.id, hostelId, dto);
  }

  @Get(':studentId')
  get(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.studentsService.findOne(user.id, hostelId, studentId);
  }

  @Patch(':studentId')
  update(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('studentId') studentId: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user.id, hostelId, studentId, dto);
  }

  @Delete(':studentId')
  remove(
    @CurrentUser() user: any,
    @Param('hostelId') hostelId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.studentsService.remove(user.id, hostelId, studentId);
  }
}
