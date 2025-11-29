import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { HostelsService } from '../hostels/hostels.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private readonly repo;
    private readonly hostelsService;
    constructor(repo: Repository<Room>, hostelsService: HostelsService);
    create(ownerId: string, hostelId: string, dto: CreateRoomDto): Promise<Room>;
    findAll(ownerId: string, hostelId: string): Promise<Room[]>;
    get(ownerId: string, hostelId: string, roomId: string): Promise<Room>;
    private findOne;
    update(ownerId: string, hostelId: string, roomId: string, dto: UpdateRoomDto): Promise<Room>;
    remove(ownerId: string, hostelId: string, roomId: string): Promise<{
        deleted: boolean;
    }>;
}
