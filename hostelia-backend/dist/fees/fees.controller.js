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
exports.FeesController = void 0;
const common_1 = require("@nestjs/common");
const fees_service_1 = require("./fees.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_fee_dto_1 = require("./dto/create-fee.dto");
const update_fee_dto_1 = require("./dto/update-fee.dto");
let FeesController = class FeesController {
    constructor(feesService) {
        this.feesService = feesService;
    }
    list(user, hostelId) {
        return this.feesService.list(user.id, hostelId);
    }
    create(user, hostelId, studentId, dto) {
        return this.feesService.create(user.id, hostelId, studentId, dto);
    }
    update(user, hostelId, feeId, dto) {
        return this.feesService.updateStatus(user.id, hostelId, feeId, dto);
    }
    receipt(user, hostelId, feeId) {
        return this.feesService.getReceipt(user.id, hostelId, feeId);
    }
};
exports.FeesController = FeesController;
__decorate([
    (0, common_1.Get)('hostels/:hostelId/fees'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('hostelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('hostels/:hostelId/students/:studentId/fees'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('hostelId')),
    __param(2, (0, common_1.Param)('studentId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, create_fee_dto_1.CreateFeeDto]),
    __metadata("design:returntype", void 0)
], FeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('hostels/:hostelId/fees/:feeId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('hostelId')),
    __param(2, (0, common_1.Param)('feeId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_fee_dto_1.UpdateFeeDto]),
    __metadata("design:returntype", void 0)
], FeesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('hostels/:hostelId/fees/:feeId/receipt'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('hostelId')),
    __param(2, (0, common_1.Param)('feeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FeesController.prototype, "receipt", null);
exports.FeesController = FeesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fees_service_1.FeesService])
], FeesController);
//# sourceMappingURL=fees.controller.js.map