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
import { Student } from '../students/student.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomNumber: string;

  @Column('int')
  capacity: number;

  @ManyToOne(() => Hostel, (hostel) => hostel.rooms, {
    onDelete: 'CASCADE',
  })
  hostel: Hostel;

  @OneToMany(() => Student, (student) => student.room)
  students: Student[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
