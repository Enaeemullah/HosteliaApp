import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { HostelsModule } from '../hostels/hostels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), forwardRef(() => HostelsModule)],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
