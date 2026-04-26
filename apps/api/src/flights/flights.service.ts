import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightEntity } from './flight.entity';
import { Flight } from '@flight-booking/models';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(FlightEntity)
    private readonly flightRepo: Repository<FlightEntity>
  ) {}

  async findAll(): Promise<Flight[]> {
    const entities = await this.flightRepo.find();
    return entities.map(this.toModel);
  }

  async findOne(id: string): Promise<Flight | null> {
    const entity = await this.flightRepo.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  private toModel(e: FlightEntity): Flight {
    return {
      id: e.id,
      flightNumber: e.flightNumber,
      airline: e.airline,
      origin: e.origin,
      destination: e.destination,
      departureTime: e.departureTime.toISOString(),
      arrivalTime: e.arrivalTime.toISOString(),
      price: Number(e.price),
      cabinClass: e.cabinClass,
      availableSeats: e.availableSeats,
    };
  }
}
