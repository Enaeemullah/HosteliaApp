import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { HostelsService } from '../hostels/hostels.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly repo: Repository<Room>,
    private readonly hostelsService: HostelsService,
  ) {}

  async create(ownerId: string, hostelId: string, dto: CreateRoomDto) {
    const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const existing = await this.repo.findOne({ where: { hostel: { id: hostelId }, roomNumber: dto.roomNumber } });
    if (existing) {
      throw new ConflictException('Room number already exists in this hostel');
    }
    const room = this.repo.create({ ...dto, hostel });
    return this.repo.save(room);
  }

  async findAll(ownerId: string, hostelId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    return this.repo.find({ where: { hostel: { id: hostelId } }, relations: ['students'] });
  }

  async get(ownerId: string, hostelId: string, roomId: string) {
    return this.findOne(ownerId, hostelId, roomId);
  }

  private async findOne(ownerId: string, hostelId: string, roomId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const room = await this.repo.findOne({
      where: { id: roomId, hostel: { id: hostelId } },
      relations: ['students'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(ownerId: string, hostelId: string, roomId: string, dto: UpdateRoomDto) {
    const room = await this.findOne(ownerId, hostelId, roomId);
    Object.assign(room, dto);
    return this.repo.save(room);
  }

  async remove(ownerId: string, hostelId: string, roomId: string) {
    const room = await this.findOne(ownerId, hostelId, roomId);
    await this.repo.remove(room);
    return { deleted: true };
  }
}
