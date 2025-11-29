import { Hostel } from '../hostels/hostel.entity';
import { Student } from '../students/student.entity';
export declare class Room {
    id: string;
    roomNumber: string;
    capacity: number;
    hostel: Hostel;
    students: Student[];
    createdAt: Date;
    updatedAt: Date;
}
