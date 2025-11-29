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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./room.entity");
const hostels_service_1 = require("../hostels/hostels.service");
let RoomsService = class RoomsService {
    constructor(repo, hostelsService) {
        this.repo = repo;
        this.hostelsService = hostelsService;
    }
    async create(ownerId, hostelId, dto) {
        const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const existing = await this.repo.findOne({ where: { hostel: { id: hostelId }, roomNumber: dto.roomNumber } });
        if (existing) {
            throw new common_1.ConflictException('Room number already exists in this hostel');
        }
        const room = this.repo.create({ ...dto, hostel });
        return this.repo.save(room);
    }
    async findAll(ownerId, hostelId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        return this.repo.find({ where: { hostel: { id: hostelId } }, relations: ['students'] });
    }
    async get(ownerId, hostelId, roomId) {
        return this.findOne(ownerId, hostelId, roomId);
    }
    async findOne(ownerId, hostelId, roomId) {
        await this.hostelsService.findOneForOwner(hostelId, ownerId);
        const room = await this.repo.findOne({
            where: { id: roomId, hostel: { id: hostelId } },
            relations: ['students'],
        });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
    async update(ownerId, hostelId, roomId, dto) {
        const room = await this.findOne(ownerId, hostelId, roomId);
        Object.assign(room, dto);
        return this.repo.save(room);
    }
    async remove(ownerId, hostelId, roomId) {
        const room = await this.findOne(ownerId, hostelId, roomId);
        await this.repo.remove(room);
        return { deleted: true };
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hostels_service_1.HostelsService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map