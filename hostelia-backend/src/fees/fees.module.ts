import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fee } from './fee.entity';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { HostelsModule } from '../hostels/hostels.module';
import { Student } from '../students/student.entity';
import { Receipt } from '../receipts/receipt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fee, Student, Receipt]),
    forwardRef(() => HostelsModule),
  ],
  providers: [FeesService],
  controllers: [FeesController],
  exports: [FeesService],
})
export class FeesModule {}
