import { Hostel } from '../hostels/hostel.entity';
import { Room } from '../rooms/room.entity';
import { Fee } from '../fees/fee.entity';
export declare class Student {
    id: string;
    name: string;
    rollNumber: string;
    email?: string;
    phone?: string;
    monthlyFee: number;
    hostel: Hostel;
    room?: Room;
    fees: Fee[];
    createdAt: Date;
    updatedAt: Date;
}
