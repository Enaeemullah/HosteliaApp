import { Repository } from 'typeorm';
import { Fee } from './fee.entity';
import { Student } from '../students/student.entity';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { HostelsService } from '../hostels/hostels.service';
import { Receipt } from '../receipts/receipt.entity';
export declare class FeesService {
    private readonly feesRepo;
    private readonly studentsRepo;
    private readonly receiptsRepo;
    private readonly hostelsService;
    constructor(feesRepo: Repository<Fee>, studentsRepo: Repository<Student>, receiptsRepo: Repository<Receipt>, hostelsService: HostelsService);
    create(ownerId: string, hostelId: string, studentId: string, dto: CreateFeeDto): Promise<Fee>;
    list(ownerId: string, hostelId: string): Promise<Fee[]>;
    updateStatus(ownerId: string, hostelId: string, feeId: string, dto: UpdateFeeDto): Promise<Fee>;
    getReceipt(ownerId: string, hostelId: string, feeId: string): Promise<Receipt>;
    private saveReceipt;
}
