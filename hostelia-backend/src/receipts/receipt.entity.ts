import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Fee } from '../fees/fee.entity';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reference: string;

  @Column({ type: 'timestamp' })
  paidOn: Date;

  @Column({ nullable: true })
  notes?: string;

  @OneToOne(() => Fee, (fee) => fee.receipt, { onDelete: 'CASCADE' })
  fee: Fee;

  @CreateDateColumn()
  generatedAt: Date;
}
