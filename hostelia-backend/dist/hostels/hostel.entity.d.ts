import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';
import { Student } from '../students/student.entity';
export declare class Hostel {
    id: string;
    name: string;
    address: string;
    description?: string;
    owner: User;
    rooms: Room[];
    students: Student[];
    createdAt: Date;
    updatedAt: Date;
}
