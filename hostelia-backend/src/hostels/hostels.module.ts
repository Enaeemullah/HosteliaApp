import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hostel } from './hostel.entity';
import { HostelsService } from './hostels.service';
import { HostelsController } from './hostels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hostel])],
  providers: [HostelsService],
  controllers: [HostelsController],
  exports: [HostelsService],
})
export class HostelsModule {}
