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
exports.HostelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hostel_entity_1 = require("./hostel.entity");
let HostelsService = class HostelsService {
    constructor(repo) {
        this.repo = repo;
    }
    async createForOwner(owner, dto) {
        const hostel = this.repo.create({ ...dto, owner });
        return this.repo.save(hostel);
    }
    findAllForOwner(ownerId) {
        return this.repo.find({
            where: { owner: { id: ownerId } },
            relations: ['rooms', 'students'],
        });
    }
    async findOneForOwner(id, ownerId) {
        const hostel = await this.repo.findOne({
            where: { id, owner: { id: ownerId } },
            relations: ['rooms', 'students'],
        });
        if (!hostel) {
            throw new common_1.NotFoundException('Hostel not found');
        }
        return hostel;
    }
    async updateForOwner(id, ownerId, dto) {
        const hostel = await this.findOneForOwner(id, ownerId);
        Object.assign(hostel, dto);
        return this.repo.save(hostel);
    }
    async removeForOwner(id, ownerId) {
        const hostel = await this.findOneForOwner(id, ownerId);
        await this.repo.remove(hostel);
        return { deleted: true };
    }
};
exports.HostelsService = HostelsService;
exports.HostelsService = HostelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hostel_entity_1.Hostel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HostelsService);
//# sourceMappingURL=hostels.service.js.map