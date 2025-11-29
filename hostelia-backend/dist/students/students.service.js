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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./student.entity");
const hostels_service_1 = require("../hostels/hostels.service");
const room_entity_1 = require("../rooms/room.entity");
let StudentsService = class StudentsService {
    constructor(repo, roomsRepo, hostelsService) {
        this.repo = repo;
        this.roomsRepo = roomsRepo;
        this.hostelsService = hostelsService;
    }
    async create(ownerId, hostelId, dto) {
        const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
        let room;
        if (dto.roomId) {
            const roomRecord = await this.roomsRepo.findOne({
                where: { id: dto.roomId, hostel: { id: hostelId } },
                relations: ['students'],
            });
            if (!roomRecord) {
                throw new common_1.NotFoundException('Room does not belong to this hostel');
            }
            if (roomRecord.students.length >= roomRecord.capacity) {
                throw new common_1.NotFoundException('Room is already at full capacity');
            }
            room = roomRecord;
        }
        const student = this.repo.create({
            name: dto.name,
            rollNumber: dto.rollNumber,
            email: dto.email,
            phone: dto.phone,
            monthlyFee: dto.monthlyFee,
            hostel,
            room,
        });
        return this.repo.save(student);
    }
    async findAll(ownerId, hostelId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        return this.repo.find({
            where: { hostel: { id: hostelId } },
            relations: ['room', 'fees'],
            order: { name: 'ASC' },
        });
    }
    async findOne(ownerId, hostelId, studentId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const student = await this.repo.findOne({
            where: { id: studentId, hostel: { id: hostelId } },
            relations: ['room', 'fees'],
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return student;
    }
    async update(ownerId, hostelId, studentId, dto) {
        const student = await this.findOne(ownerId, hostelId, studentId);
        if (dto.roomId) {
            const room = await this.roomsRepo.findOne({
                where: { id: dto.roomId, hostel: { id: hostelId } },
                relations: ['students'],
            });
            if (!room) {
                throw new common_1.NotFoundException('Room does not belong to this hostel');
            }
            if (room.students.length >= room.capacity) {
                throw new common_1.NotFoundException('Room is already at full capacity');
            }
            student.room = room;
        }
        else if (dto.roomId === null) {
            student.room = undefined;
        }
        const { roomId, ...rest } = dto;
        Object.assign(student, rest);
        return this.repo.save(student);
    }
    async remove(ownerId, hostelId, studentId) {
        const student = await this.findOne(ownerId, hostelId, studentId);
        await this.repo.remove(student);
        return { deleted: true };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        hostels_service_1.HostelsService])
], StudentsService);
//# sourceMappingURL=students.service.js.map