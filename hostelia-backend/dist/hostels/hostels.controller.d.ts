import { HostelsService } from './hostels.service';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
export declare class HostelsController {
    private readonly hostelsService;
    constructor(hostelsService: HostelsService);
    list(user: any): Promise<import("./hostel.entity").Hostel[]>;
    create(user: any, dto: CreateHostelDto): Promise<import("./hostel.entity").Hostel>;
    get(user: any, id: string): Promise<import("./hostel.entity").Hostel>;
    update(user: any, id: string, dto: UpdateHostelDto): Promise<import("./hostel.entity").Hostel>;
    remove(user: any, id: string): Promise<{
        deleted: boolean;
    }>;
}
