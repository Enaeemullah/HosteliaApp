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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../rooms/room.entity");
const student_entity_1 = require("../students/student.entity");
const fee_entity_1 = require("../fees/fee.entity");
const hostels_service_1 = require("../hostels/hostels.service");
const fee_status_enum_1 = require("../common/enums/fee-status.enum");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
let ReportsService = class ReportsService {
    constructor(roomsRepo, studentsRepo, feesRepo, hostelsService) {
        this.roomsRepo = roomsRepo;
        this.studentsRepo = studentsRepo;
        this.feesRepo = feesRepo;
        this.hostelsService = hostelsService;
    }
    async getDashboard(ownerId, hostelId) {
        var _a;
        const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const [totalRooms, totalStudents, pendingFees] = await Promise.all([
            this.roomsRepo.count({ where: { hostel: { id: hostelId } } }),
            this.studentsRepo.count({ where: { hostel: { id: hostelId } } }),
            this.feesRepo.count({ where: { student: { hostel: { id: hostelId } }, status: fee_status_enum_1.FeeStatus.PENDING } }),
        ]);
        const students = await this.studentsRepo.find({ where: { hostel: { id: hostelId } }, relations: ['room'] });
        const studentsPerRoom = students.reduce((acc, student) => {
            if (student.room) {
                const key = student.room.roomNumber;
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
        const occupiedRooms = Object.keys(studentsPerRoom).length;
        const vacantRooms = totalRooms - occupiedRooms;
        let pendingAmountRaw;
        if (students.length) {
            pendingAmountRaw = await this.feesRepo
                .createQueryBuilder('fee')
                .select('SUM(fee.amount)', 'pending')
                .where('fee.status != :status', { status: fee_status_enum_1.FeeStatus.PAID })
                .andWhere('fee.studentId IN (:...studentIds)', { studentIds: students.map((s) => s.id) })
                .getRawOne();
        }
        const pendingAmount = Number((_a = pendingAmountRaw === null || pendingAmountRaw === void 0 ? void 0 : pendingAmountRaw.pending) !== null && _a !== void 0 ? _a : 0);
        return {
            hostel: { id: hostel.id, name: hostel.name },
            totalRooms,
            totalStudents,
            pendingFees,
            occupiedRooms,
            vacantRooms,
            studentsPerRoom,
            pendingAmount,
        };
    }
    async export(ownerId, hostelId, format) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const rows = await this.feesRepo.find({
            where: { student: { hostel: { id: hostelId } } },
            relations: ['student', 'student.room'],
            order: { dueDate: 'ASC' },
        });
        if (format === 'csv') {
            return this.toCsv(rows);
        }
        if (format === 'excel') {
            return this.toExcel(rows);
        }
        return this.toPdf(rows);
    }
    toCsv(rows) {
        const header = 'Student,Roll,Room,Amount,Due Date,Status\n';
        const body = rows
            .map((fee) => {
            var _a, _b;
            const student = fee.student;
            return [
                student.name,
                student.rollNumber,
                (_b = (_a = student.room) === null || _a === void 0 ? void 0 : _a.roomNumber) !== null && _b !== void 0 ? _b : 'Unassigned',
                fee.amount,
                fee.dueDate,
                fee.status,
            ].join(',');
        })
            .join('\n');
        return {
            filename: 'hostelia-report.csv',
            mimeType: 'text/csv',
            data: Buffer.from(header + body).toString('base64'),
        };
    }
    async toExcel(rows) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Fees');
        sheet.addRow(['Student', 'Roll', 'Room', 'Amount', 'Due Date', 'Status']);
        rows.forEach((fee) => {
            var _a, _b;
            sheet.addRow([
                fee.student.name,
                fee.student.rollNumber,
                (_b = (_a = fee.student.room) === null || _a === void 0 ? void 0 : _a.roomNumber) !== null && _b !== void 0 ? _b : 'Unassigned',
                fee.amount,
                fee.dueDate,
                fee.status,
            ]);
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return {
            filename: 'hostelia-report.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            data: Buffer.from(buffer).toString('base64'),
        };
    }
    toPdf(rows) {
        const doc = new PDFDocument({ margin: 40 });
        const chunks = [];
        doc.fontSize(18).text('Hostelia Fee Report', { align: 'center' });
        doc.moveDown();
        rows.forEach((fee) => {
            var _a, _b;
            doc
                .fontSize(12)
                .text(`Student: ${fee.student.name} (${fee.student.rollNumber})`)
                .text(`Room: ${(_b = (_a = fee.student.room) === null || _a === void 0 ? void 0 : _a.roomNumber) !== null && _b !== void 0 ? _b : 'Unassigned'}`)
                .text(`Amount: ${fee.amount}`)
                .text(`Due: ${fee.dueDate} Status: ${fee.status}`)
                .moveDown();
        });
        doc.on('data', (chunk) => chunks.push(chunk));
        return new Promise((resolve) => {
            doc.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve({
                    filename: 'hostelia-report.pdf',
                    mimeType: 'application/pdf',
                    data: buffer.toString('base64'),
                });
            });
            doc.end();
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(fee_entity_1.Fee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        hostels_service_1.HostelsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map