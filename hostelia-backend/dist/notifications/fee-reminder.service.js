"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FeeReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeReminderService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fee_entity_1 = require("../fees/fee.entity");
const fee_status_enum_1 = require("../common/enums/fee-status.enum");
const notifications_service_1 = require("./notifications.service");
let FeeReminderService = FeeReminderService_1 = class FeeReminderService {
    constructor(feesRepo, notificationsService) {
        this.feesRepo = feesRepo;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(FeeReminderService_1.name);
    }
    async handleReminders() {
        const now = new Date();
        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(now.getDate() + 5);
        const start = now.toISOString().substring(0, 10);
        const end = fiveDaysFromNow.toISOString().substring(0, 10);
        const fees = await this.feesRepo.find({
            where: {
                status: fee_status_enum_1.FeeStatus.PENDING,
                dueDate: (0, typeorm_2.Between)(start, end),
                reminderSent: false,
            },
            relations: ['student'],
        });
        await Promise.all(fees.map(async (fee) => {
            await this.notificationsService.sendFeeReminder(fee.student.email || '', {
                student: fee.student.name,
                amount: fee.amount,
                dueDate: fee.dueDate,
            });
            fee.reminderSent = true;
            await this.feesRepo.save(fee);
        }));
        this.logger.log(`Checked ${fees.length} fees for reminders`);
    }
};
exports.FeeReminderService = FeeReminderService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeeReminderService.prototype, "handleReminders", null);
exports.FeeReminderService = FeeReminderService = FeeReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fee_entity_1.Fee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], FeeReminderService);
//# sourceMappingURL=fee-reminder.service.js.map