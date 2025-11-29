import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostel } from './hostel.entity';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { User } from '../users/user.entity';

@Injectable()
export class HostelsService {
  constructor(
    @InjectRepository(Hostel)
    private readonly repo: Repository<Hostel>,
  ) {}

  async createForOwner(owner: User, dto: CreateHostelDto) {
    const hostel = this.repo.create({ ...dto, owner });
    return this.repo.save(hostel);
  }

  findAllForOwner(ownerId: string) {
    return this.repo.find({
      where: { owner: { id: ownerId } },
      relations: ['rooms', 'students'],
    });
  }

  async findOneForOwner(id: string, ownerId: string) {
    const hostel = await this.repo.findOne({
      where: { id, owner: { id: ownerId } },
      relations: ['rooms', 'students'],
    });
    if (!hostel) {
      throw new NotFoundException('Hostel not found');
    }
    return hostel;
  }

  async updateForOwner(id: string, ownerId: string, dto: UpdateHostelDto) {
    const hostel = await this.findOneForOwner(id, ownerId);
    Object.assign(hostel, dto);
    return this.repo.save(hostel);
  }

  async removeForOwner(id: string, ownerId: string) {
    const hostel = await this.findOneForOwner(id, ownerId);
    await this.repo.remove(hostel);
    return { deleted: true };
  }
}
