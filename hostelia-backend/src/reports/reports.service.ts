import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Student } from '../students/student.entity';
import { Fee } from '../fees/fee.entity';
import { HostelsService } from '../hostels/hostels.service';
import { FeeStatus } from '../common/enums/fee-status.enum';
import PDFDocument = require('pdfkit');
import ExcelJS = require('exceljs');

type ExportPayload = {
  filename: string;
  mimeType: string;
  data: string; // base64
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,
    @InjectRepository(Student)
    private readonly studentsRepo: Repository<Student>,
    @InjectRepository(Fee)
    private readonly feesRepo: Repository<Fee>,
    private readonly hostelsService: HostelsService,
  ) {}

  async getDashboard(ownerId: string, hostelId: string) {
    const hostel = await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const [totalRooms, totalStudents, pendingFees] = await Promise.all([
      this.roomsRepo.count({ where: { hostel: { id: hostelId } } }),
      this.studentsRepo.count({ where: { hostel: { id: hostelId } } }),
      this.feesRepo.count({ where: { student: { hostel: { id: hostelId } }, status: FeeStatus.PENDING } }),
    ]);

    const students = await this.studentsRepo.find({ where: { hostel: { id: hostelId } }, relations: ['room'] });

    const studentsPerRoom = students.reduce<Record<string, number>>((acc, student) => {
      if (student.room) {
        const key = student.room.roomNumber;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    const occupiedRooms = Object.keys(studentsPerRoom).length;
    const vacantRooms = totalRooms - occupiedRooms;

    let pendingAmount = { pending: 0 };
    if (students.length) {
      pendingAmount = await this.feesRepo
        .createQueryBuilder('fee')
        .select('SUM(fee.amount)', 'pending')
        .where('fee.status != :status', { status: FeeStatus.PAID })
        .andWhere('fee.studentId IN (:...studentIds)', { studentIds: students.map((s) => s.id) })
        .getRawOne();
    }

    return {
      hostel: { id: hostel.id, name: hostel.name },
      totalRooms,
      totalStudents,
      pendingFees,
      occupiedRooms,
      vacantRooms,
      studentsPerRoom,
      pendingAmount: Number(pendingAmount?.pending || 0),
    };
  }

  async export(ownerId: string, hostelId: string, format: 'csv' | 'excel' | 'pdf') {
    await this.hostelsService.findOneForOwner(hostelId, ownerId);
    const rows = await this.feesRepo.find({
      where: { student: { hostel: { id: hostelId } } },
      relations: ['student', 'student.room'],
      order: { dueDate: 'ASC' },
    });

    if (format === 'csv') {
      return this.toCsv(rows);
    }
    if (format === 'excel') {
      return this.toExcel(rows);
    }
    return this.toPdf(rows);
  }

  private toCsv(rows: Fee[]): ExportPayload {
    const header = 'Student,Roll,Room,Amount,Due Date,Status\n';
    const body = rows
      .map((fee) => {
        const student = fee.student;
        return [
          student.name,
          student.rollNumber,
          student.room?.roomNumber ?? 'Unassigned',
          fee.amount,
          fee.dueDate,
          fee.status,
        ].join(',');
      })
      .join('\n');
    return {
      filename: 'hostelia-report.csv',
      mimeType: 'text/csv',
      data: Buffer.from(header + body).toString('base64'),
    };
  }

  private async toExcel(rows: Fee[]): Promise<ExportPayload> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Fees');
    sheet.addRow(['Student', 'Roll', 'Room', 'Amount', 'Due Date', 'Status']);
    rows.forEach((fee) => {
      sheet.addRow([
        fee.student.name,
        fee.student.rollNumber,
        fee.student.room?.roomNumber ?? 'Unassigned',
        fee.amount,
        fee.dueDate,
        fee.status,
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return {
      filename: 'hostelia-report.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: Buffer.from(buffer).toString('base64'),
    };
  }

  private toPdf(rows: Fee[]): Promise<ExportPayload> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.fontSize(18).text('Hostelia Fee Report', { align: 'center' });
    doc.moveDown();
    rows.forEach((fee) => {
      doc
        .fontSize(12)
        .text(`Student: ${fee.student.name} (${fee.student.rollNumber})`)
        .text(`Room: ${fee.student.room?.roomNumber ?? 'Unassigned'}`)
        .text(`Amount: ${fee.amount}`)
        .text(`Due: ${fee.dueDate} Status: ${fee.status}`)
        .moveDown();
    });
    doc.on('data', (chunk) => chunks.push(chunk));
    return new Promise((resolve) => {
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          filename: 'hostelia-report.pdf',
          mimeType: 'application/pdf',
          data: buffer.toString('base64'),
        });
      });
      doc.end();
    });
  }
}
