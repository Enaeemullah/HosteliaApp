import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { FeeStatus } from '../common/enums/fee-status.enum';
import { Receipt } from '../receipts/receipt.entity';

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({ type: 'enum', enum: FeeStatus, default: FeeStatus.PENDING })
  status: FeeStatus;

  @Column({ default: false })
  reminderSent: boolean;

  @ManyToOne(() => Student, (student) => student.fees, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToOne(() => Receipt, (receipt) => receipt.fee, { nullable: true })
  receipt?: Receipt;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
