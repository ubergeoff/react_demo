import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightEntity } from './flight.entity';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlightEntity])],
  providers: [FlightsService],
  controllers: [FlightsController],
  exports: [FlightsService, TypeOrmModule],
})
export class FlightsModule {}
