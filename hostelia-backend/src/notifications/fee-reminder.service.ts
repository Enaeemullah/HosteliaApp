import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Fee } from '../fees/fee.entity';
import { FeeStatus } from '../common/enums/fee-status.enum';
import { NotificationsService } from './notifications.service';

@Injectable()
export class FeeReminderService {
  private readonly logger = new Logger(FeeReminderService.name);

  constructor(
    @InjectRepository(Fee)
    private readonly feesRepo: Repository<Fee>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleReminders() {
    const now = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(now.getDate() + 5);

    const start = now.toISOString().substring(0, 10);
    const end = fiveDaysFromNow.toISOString().substring(0, 10);

    const fees = await this.feesRepo.find({
      where: {
        status: FeeStatus.PENDING,
        dueDate: Between(start, end),
        reminderSent: false,
      },
      relations: ['student'],
    });

    await Promise.all(
      fees.map(async (fee) => {
        await this.notificationsService.sendFeeReminder(fee.student.email || '', {
          student: fee.student.name,
          amount: fee.amount,
          dueDate: fee.dueDate,
        });
        fee.reminderSent = true;
        await this.feesRepo.save(fee);
      }),
    );

    this.logger.log(`Checked ${fees.length} fees for reminders`);
  }
}
