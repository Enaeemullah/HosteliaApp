import { Repository } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Student } from '../students/student.entity';
import { Fee } from '../fees/fee.entity';
import { HostelsService } from '../hostels/hostels.service';
type ExportPayload = {
    filename: string;
    mimeType: string;
    data: string;
};
export declare class ReportsService {
    private readonly roomsRepo;
    private readonly studentsRepo;
    private readonly feesRepo;
    private readonly hostelsService;
    constructor(roomsRepo: Repository<Room>, studentsRepo: Repository<Student>, feesRepo: Repository<Fee>, hostelsService: HostelsService);
    getDashboard(ownerId: string, hostelId: string): Promise<{
        hostel: {
            id: string;
            name: string;
        };
        totalRooms: number;
        totalStudents: number;
        pendingFees: number;
        occupiedRooms: number;
        vacantRooms: number;
        studentsPerRoom: Record<string, number>;
        pendingAmount: number;
    }>;
    export(ownerId: string, hostelId: string, format: 'csv' | 'excel' | 'pdf'): Promise<ExportPayload>;
    private toCsv;
    private toExcel;
    private toPdf;
}
export {};
