import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    list(user: any, hostelId: string): Promise<import("./room.entity").Room[]>;
    create(user: any, hostelId: string, dto: CreateRoomDto): Promise<import("./room.entity").Room>;
    get(user: any, hostelId: string, roomId: string): Promise<import("./room.entity").Room>;
    update(user: any, hostelId: string, roomId: string, dto: UpdateRoomDto): Promise<import("./room.entity").Room>;
    remove(user: any, hostelId: string, roomId: string): Promise<{
        deleted: boolean;
    }>;
}
