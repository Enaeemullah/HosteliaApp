import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Room } from '../rooms/room.entity';
import { Student } from '../students/student.entity';
import { Fee } from '../fees/fee.entity';
import { HostelsModule } from '../hostels/hostels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Student, Fee]),
    forwardRef(() => HostelsModule),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
