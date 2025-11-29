import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FeeReminderService } from './fee-reminder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fee } from '../fees/fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fee])],
  providers: [NotificationsService, FeeReminderService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
