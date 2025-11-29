import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Hostel } from '../hostels/hostel.entity';
import { Room } from '../rooms/room.entity';
import { Student } from '../students/student.entity';
import { Fee } from '../fees/fee.entity';
import { Receipt } from '../receipts/receipt.entity';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'hostelia',
  synchronize: true,
  entities: [User, Hostel, Room, Student, Fee, Receipt],
  logging: process.env.NODE_ENV !== 'production',
});
