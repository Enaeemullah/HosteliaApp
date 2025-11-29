import { Repository } from 'typeorm';
import { Fee } from '../fees/fee.entity';
import { NotificationsService } from './notifications.service';
export declare class FeeReminderService {
    private readonly feesRepo;
    private readonly notificationsService;
    private readonly logger;
    constructor(feesRepo: Repository<Fee>, notificationsService: NotificationsService);
    handleReminders(): Promise<void>;
}
