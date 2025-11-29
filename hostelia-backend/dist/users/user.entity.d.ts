import { Hostel } from '../hostels/hostel.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name?: string;
    hostels: Hostel[];
    createdAt: Date;
    updatedAt: Date;
}
