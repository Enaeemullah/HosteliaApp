import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { HostelsService } from '../hostels/hostels.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Room } from '../rooms/room.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,
    private readonly hostelsService: HostelsService,
  ) {}

  async create(ownerId: string, hostelId: string, dto: CreateStudentDto) {
    const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
    let room: Room | undefined;
    if (dto.roomId) {
      room = await this.roomsRepo.findOne({
        where: { id: dto.roomId, hostel: { id: hostelId } },
        relations: ['students'],
      });
      if (!room) {
        throw new NotFoundException('Room does not belong to this hostel');
      }
      if (room.students.length >= room.capacity) {
        throw new NotFoundException('Room is already at full capacity');
      }
    }
    const student = this.repo.create({
      name: dto.name,
      rollNumber: dto.rollNumber,
      email: dto.email,
      phone: dto.phone,
      monthlyFee: dto.monthlyFee,
      hostel,
      room,
    });
    return this.repo.save(student);
  }

  async findAll(ownerId: string, hostelId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    return this.repo.find({
      where: { hostel: { id: hostelId } },
      relations: ['room', 'fees'],
      order: { name: 'ASC' },
    });
  }

  async findOne(ownerId: string, hostelId: string, studentId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const student = await this.repo.findOne({
      where: { id: studentId, hostel: { id: hostelId } },
      relations: ['room', 'fees'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(ownerId: string, hostelId: string, studentId: string, dto: UpdateStudentDto) {
    const student = await this.findOne(ownerId, hostelId, studentId);
    if (dto.roomId) {
      const room = await this.roomsRepo.findOne({
        where: { id: dto.roomId, hostel: { id: hostelId } },
        relations: ['students'],
      });
      if (!room) {
        throw new NotFoundException('Room does not belong to this hostel');
      }
      if (room.students.length >= room.capacity) {
        throw new NotFoundException('Room is already at full capacity');
      }
      student.room = room;
    } else if (dto.roomId === null) {
      student.room = undefined;
    }
    const { roomId, ...rest } = dto as any;
    Object.assign(student, rest);
    return this.repo.save(student);
  }

  async remove(ownerId: string, hostelId: string, studentId: string) {
    const student = await this.findOne(ownerId, hostelId, studentId);
    await this.repo.remove(student);
    return { deleted: true };
  }
}
