import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    list(user: any, hostelId: string): Promise<import("./student.entity").Student[]>;
    create(user: any, hostelId: string, dto: CreateStudentDto): Promise<import("./student.entity").Student>;
    get(user: any, hostelId: string, studentId: string): Promise<import("./student.entity").Student>;
    update(user: any, hostelId: string, studentId: string, dto: UpdateStudentDto): Promise<import("./student.entity").Student>;
    remove(user: any, hostelId: string, studentId: string): Promise<{
        deleted: boolean;
    }>;
}
