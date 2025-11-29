import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { HostelsService } from '../hostels/hostels.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Room } from '../rooms/room.entity';
export declare class StudentsService {
    private readonly repo;
    private readonly roomsRepo;
    private readonly hostelsService;
    constructor(repo: Repository<Student>, roomsRepo: Repository<Room>, hostelsService: HostelsService);
    create(ownerId: string, hostelId: string, dto: CreateStudentDto): Promise<Student>;
    findAll(ownerId: string, hostelId: string): Promise<Student[]>;
    findOne(ownerId: string, hostelId: string, studentId: string): Promise<Student>;
    update(ownerId: string, hostelId: string, studentId: string, dto: UpdateStudentDto): Promise<Student>;
    remove(ownerId: string, hostelId: string, studentId: string): Promise<{
        deleted: boolean;
    }>;
}
