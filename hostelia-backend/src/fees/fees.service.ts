import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee } from './fee.entity';
import { Student } from '../students/student.entity';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { HostelsService } from '../hostels/hostels.service';
import { Receipt } from '../receipts/receipt.entity';
import { FeeStatus } from '../common/enums/fee-status.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee)
    private readonly feesRepo: Repository<Fee>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Receipt)
    private readonly receiptsRepo: Repository<Receipt>,
    private readonly hostelsService: HostelsService,
  ) {}

  async create(ownerId: string, hostelId: string, studentId: string, dto: CreateFeeDto) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const student = await this.studentsRepo.findOne({ where: { id: studentId, hostel: { id: hostelId } } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const fee = this.feesRepo.create({
      amount: dto.amount,
      dueDate: dto.dueDate,
      status: dto.status ?? FeeStatus.PENDING,
      student,
    });
    return this.feesRepo.save(fee);
  }

  async list(ownerId: string, hostelId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    return this.feesRepo.find({
      where: { student: { hostel: { id: hostelId } } },
      relations: ['student', 'student.room', 'receipt'],
      order: { dueDate: 'ASC' },
    });
  }

  async updateStatus(ownerId: string, hostelId: string, feeId: string, dto: UpdateFeeDto) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const fee = await this.feesRepo.findOne({ where: { id: feeId, student: { hostel: { id: hostelId } } }, relations: ['student', 'receipt'] });
    if (!fee) {
      throw new NotFoundException('Fee not found');
    }
    fee.status = dto.status;
    if (dto.status === FeeStatus.PAID) {
      fee.receipt = await this.saveReceipt(fee, dto.notes);
      fee.reminderSent = true;
    } else {
      fee.reminderSent = false;
    }
    return this.feesRepo.save(fee);
  }

  async getReceipt(ownerId: string, hostelId: string, feeId: string) {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const fee = await this.feesRepo.findOne({
      where: { id: feeId, student: { hostel: { id: hostelId } } },
      relations: ['receipt', 'student'],
    });
    if (!fee || !fee.receipt) {
      throw new NotFoundException('Receipt not available');
    }
    return fee.receipt;
  }

  private async saveReceipt(fee: Fee, notes?: string) {
    if (fee.receipt) {
      return this.receiptsRepo.save({ ...fee.receipt, notes });
    }
    const receipt = this.receiptsRepo.create({
      fee,
      reference: `HOSTELIA-${randomUUID().split('-')[0].toUpperCase()}`,
      paidOn: new Date(),
      notes,
    });
    return this.receiptsRepo.save(receipt);
  }
}
