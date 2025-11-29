import { Student } from '../students/student.entity';
import { FeeStatus } from '../common/enums/fee-status.enum';
import { Receipt } from '../receipts/receipt.entity';
export declare class Fee {
    id: string;
    amount: number;
    dueDate: string;
    status: FeeStatus;
    reminderSent: boolean;
    student: Student;
    receipt?: Receipt;
    createdAt: Date;
    updatedAt: Date;
}
