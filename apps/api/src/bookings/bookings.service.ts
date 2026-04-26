import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  BookingStatus,
} from '@flight-booking/models';
import { FlightEntity } from '../flights/flight.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(FlightEntity)
    private readonly flightRepo: Repository<FlightEntity>
  ) {}

  async findAll(): Promise<Booking[]> {
    const entities = await this.bookingRepo.find();
    return entities.map(this.toModel);
  }

  async findOne(id: string): Promise<Booking | null> {
    const entity = await this.bookingRepo.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const flight = await this.flightRepo.findOne({
      where: { id: dto.flightId },
    });
    if (!flight) throw new NotFoundException(`Flight ${dto.flightId} not found`);

    const booking = this.bookingRepo.create({
      bookingReference: this.generateRef(),
      flightId: dto.flightId,
      passenger: dto.passenger,
      status: BookingStatus.CONFIRMED,
      totalPrice: flight.price,
      seatNumber: dto.seatNumber,
    });

    const saved = await this.bookingRepo.save(booking);
    return this.toModel(saved);
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const entity = await this.bookingRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Booking ${id} not found`);

    if (dto.passenger) entity.passenger = { ...entity.passenger, ...dto.passenger };
    if (dto.status) entity.status = dto.status;
    if (dto.seatNumber) entity.seatNumber = dto.seatNumber;

    const saved = await this.bookingRepo.save(entity);
    return this.toModel(saved);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.bookingRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Booking ${id} not found`);
    await this.bookingRepo.remove(entity);
  }

  private toModel(e: BookingEntity): Booking {
    return {
      id: e.id,
      bookingReference: e.bookingReference,
      flightId: e.flightId,
      flight: e.flight
        ? {
            id: e.flight.id,
            flightNumber: e.flight.flightNumber,
            airline: e.flight.airline,
            origin: e.flight.origin,
            destination: e.flight.destination,
            departureTime: e.flight.departureTime.toISOString(),
            arrivalTime: e.flight.arrivalTime.toISOString(),
            price: Number(e.flight.price),
            cabinClass: e.flight.cabinClass,
            availableSeats: e.flight.availableSeats,
          }
        : undefined,
      passenger: e.passenger,
      status: e.status,
      totalPrice: Number(e.totalPrice),
      seatNumber: e.seatNumber,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }

  private generateRef(): string {
    return 'BK' + Math.random().toString(36).toUpperCase().substring(2, 8);
  }
}
