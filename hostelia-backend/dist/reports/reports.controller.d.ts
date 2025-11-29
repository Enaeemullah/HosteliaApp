import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    dashboard(user: any, hostelId: string): Promise<{
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
    export(user: any, hostelId: string, format: 'csv' | 'excel' | 'pdf'): Promise<{
        filename: string;
        mimeType: string;
        data: string;
    }>;
}
