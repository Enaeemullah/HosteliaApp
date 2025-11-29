import { Repository } from 'typeorm';
import { Hostel } from './hostel.entity';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { User } from '../users/user.entity';
export declare class HostelsService {
    private readonly repo;
    constructor(repo: Repository<Hostel>);
    createForOwner(owner: User, dto: CreateHostelDto): Promise<Hostel>;
    findAllForOwner(ownerId: string): Promise<Hostel[]>;
    findOneForOwner(id: string, ownerId: string): Promise<Hostel>;
    updateForOwner(id: string, ownerId: string, dto: UpdateHostelDto): Promise<Hostel>;
    removeForOwner(id: string, ownerId: string): Promise<{
        deleted: boolean;
    }>;
}
