import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { FlightsModule } from '../flights/flights.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), FlightsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
