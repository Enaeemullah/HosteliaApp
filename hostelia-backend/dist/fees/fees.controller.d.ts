import { FeesService } from './fees.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
export declare class FeesController {
    private readonly feesService;
    constructor(feesService: FeesService);
    list(user: any, hostelId: string): Promise<import("./fee.entity").Fee[]>;
    create(user: any, hostelId: string, studentId: string, dto: CreateFeeDto): Promise<import("./fee.entity").Fee>;
    update(user: any, hostelId: string, feeId: string, dto: UpdateFeeDto): Promise<import("./fee.entity").Fee>;
    receipt(user: any, hostelId: string, feeId: string): Promise<import("../receipts/receipt.entity").Receipt>;
}
