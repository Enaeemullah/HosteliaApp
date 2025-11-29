import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hostel } from '../hostels/hostel.entity';
import { Room } from '../rooms/room.entity';
import { Fee } from '../fees/fee.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  rollNumber: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  monthlyFee: number;

  @ManyToOne(() => Hostel, (hostel) => hostel.students, {
    onDelete: 'CASCADE',
  })
  hostel: Hostel;

  @ManyToOne(() => Room, (room) => room.students, { nullable: true })
  room?: Room;

  @OneToMany(() => Fee, (fee) => fee.student)
  fees: Fee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
