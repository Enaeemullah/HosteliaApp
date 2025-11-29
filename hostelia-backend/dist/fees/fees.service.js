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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fee_entity_1 = require("./fee.entity");
const student_entity_1 = require("../students/student.entity");
const hostels_service_1 = require("../hostels/hostels.service");
const receipt_entity_1 = require("../receipts/receipt.entity");
const fee_status_enum_1 = require("../common/enums/fee-status.enum");
const crypto_1 = require("crypto");
let FeesService = class FeesService {
    constructor(feesRepo, studentsRepo, receiptsRepo, hostelsService) {
        this.feesRepo = feesRepo;
        this.studentsRepo = studentsRepo;
        this.receiptsRepo = receiptsRepo;
        this.hostelsService = hostelsService;
    }
    async create(ownerId, hostelId, studentId, dto) {
        var _a;
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const student = await this.studentsRepo.findOne({ where: { id: studentId, hostel: { id: hostelId } } });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const fee = this.feesRepo.create({
            amount: dto.amount,
            dueDate: dto.dueDate,
            status: (_a = dto.status) !== null && _a !== void 0 ? _a : fee_status_enum_1.FeeStatus.PENDING,
            student,
        });
        return this.feesRepo.save(fee);
    }
    async list(ownerId, hostelId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        return this.feesRepo.find({
            where: { student: { hostel: { id: hostelId } } },
            relations: ['student', 'student.room', 'receipt'],
            order: { dueDate: 'ASC' },
        });
    }
    async updateStatus(ownerId, hostelId, feeId, dto) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const fee = await this.feesRepo.findOne({ where: { id: feeId, student: { hostel: { id: hostelId } } }, relations: ['student', 'receipt'] });
        if (!fee) {
            throw new common_1.NotFoundException('Fee not found');
        }
        fee.status = dto.status;
        if (dto.status === fee_status_enum_1.FeeStatus.PAID) {
            fee.receipt = await this.saveReceipt(fee, dto.notes);
            fee.reminderSent = true;
        }
        else {
            fee.reminderSent = false;
        }
        return this.feesRepo.save(fee);
    }
    async getReceipt(ownerId, hostelId, feeId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const fee = await this.feesRepo.findOne({
            where: { id: feeId, student: { hostel: { id: hostelId } } },
            relations: ['receipt', 'student'],
        });
        if (!fee || !fee.receipt) {
            throw new common_1.NotFoundException('Receipt not available');
        }
        return fee.receipt;
    }
    async saveReceipt(fee, notes) {
        if (fee.receipt) {
            return this.receiptsRepo.save({ ...fee.receipt, notes });
        }
        const receipt = this.receiptsRepo.create({
            fee,
            reference: `HOSTELIA-${(0, crypto_1.randomUUID)().split('-')[0].toUpperCase()}`,
            paidOn: new Date(),
            notes,
        });
        return this.receiptsRepo.save(receipt);
    }
};
exports.FeesService = FeesService;
exports.FeesService = FeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fee_entity_1.Fee)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(receipt_entity_1.Receipt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        hostels_service_1.HostelsService])
], FeesService);
//# sourceMappingURL=fees.service.js.map