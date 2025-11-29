import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { HostelsModule } from '../hostels/hostels.module';
import { Room } from '../rooms/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Room]),
    forwardRef(() => HostelsModule),
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class StudentsModule {}
