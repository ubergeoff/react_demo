import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightEntity } from '../flights/flight.entity';
import { BookingEntity } from '../bookings/booking.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlightEntity, BookingEntity])],
  providers: [SeedService],
})
export class SeedModule {}
