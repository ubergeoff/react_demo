import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightEntity } from '../flights/flight.entity';
import { BookingEntity } from '../bookings/booking.entity';
import { CabinClass, BookingStatus } from '@flight-booking/models';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(FlightEntity)
    private readonly flightRepo: Repository<FlightEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>
  ) {}

  async onApplicationBootstrap() {
    const count = await this.flightRepo.count();
    if (count > 0) return;
    this.logger.log('Seeding database...');
    await this.seed();
    this.logger.log('Seeding complete.');
  }

  private async seed() {
    const flights = await this.flightRepo.save([
      {
        flightNumber: 'SA101',
        airline: 'South African Airways',
        origin: 'Johannesburg (JNB)',
        destination: 'Cape Town (CPT)',
        departureTime: new Date('2025-06-15T08:00:00Z'),
        arrivalTime: new Date('2025-06-15T10:15:00Z'),
        price: 1850.0,
        cabinClass: CabinClass.ECONOMY,
        availableSeats: 142,
      },
      {
        flightNumber: 'BA246',
        airline: 'British Airways',
        origin: 'London (LHR)',
        destination: 'New York (JFK)',
        departureTime: new Date('2025-06-16T11:30:00Z'),
        arrivalTime: new Date('2025-06-16T14:45:00Z'),
        price: 8200.0,
        cabinClass: CabinClass.BUSINESS,
        availableSeats: 48,
      },
      {
        flightNumber: 'EK412',
        airline: 'Emirates',
        origin: 'Dubai (DXB)',
        destination: 'Sydney (SYD)',
        departureTime: new Date('2025-06-17T22:00:00Z'),
        arrivalTime: new Date('2025-06-18T17:30:00Z'),
        price: 12500.0,
        cabinClass: CabinClass.FIRST,
        availableSeats: 14,
      },
      {
        flightNumber: 'QR301',
        airline: 'Qatar Airways',
        origin: 'Doha (DOH)',
        destination: 'Paris (CDG)',
        departureTime: new Date('2025-06-18T06:00:00Z'),
        arrivalTime: new Date('2025-06-18T12:30:00Z'),
        price: 6750.0,
        cabinClass: CabinClass.BUSINESS,
        availableSeats: 32,
      },
      {
        flightNumber: 'LH401',
        airline: 'Lufthansa',
        origin: 'Frankfurt (FRA)',
        destination: 'Tokyo (NRT)',
        departureTime: new Date('2025-06-19T14:00:00Z'),
        arrivalTime: new Date('2025-06-20T09:15:00Z'),
        price: 9300.0,
        cabinClass: CabinClass.ECONOMY,
        availableSeats: 220,
      },
      {
        flightNumber: 'AA789',
        airline: 'American Airlines',
        origin: 'Los Angeles (LAX)',
        destination: 'Miami (MIA)',
        departureTime: new Date('2025-06-20T07:30:00Z'),
        arrivalTime: new Date('2025-06-20T15:45:00Z'),
        price: 3200.0,
        cabinClass: CabinClass.ECONOMY,
        availableSeats: 165,
      },
    ]);

    await this.bookingRepo.save([
      {
        bookingReference: 'BKSA1001',
        flightId: flights[0].id,
        passenger: {
          firstName: 'Thabo',
          lastName: 'Nkosi',
          email: 'thabo.nkosi@email.com',
          passportNumber: 'ZA1234567',
        },
        status: BookingStatus.CONFIRMED,
        totalPrice: 1850.0,
        seatNumber: '14A',
      },
      {
        bookingReference: 'BKBA2002',
        flightId: flights[1].id,
        passenger: {
          firstName: 'Emily',
          lastName: 'Johnson',
          email: 'emily.johnson@email.com',
          passportNumber: 'UK9876543',
        },
        status: BookingStatus.CONFIRMED,
        totalPrice: 8200.0,
        seatNumber: '3C',
      },
      {
        bookingReference: 'BKEK3003',
        flightId: flights[2].id,
        passenger: {
          firstName: 'Ahmed',
          lastName: 'Al-Rashid',
          email: 'ahmed.alrashid@email.com',
          passportNumber: 'AE5555123',
        },
        status: BookingStatus.PENDING,
        totalPrice: 12500.0,
        seatNumber: '1A',
      },
      {
        bookingReference: 'BKQR4004',
        flightId: flights[3].id,
        passenger: {
          firstName: 'Sophie',
          lastName: 'Dubois',
          email: 'sophie.dubois@email.com',
          passportNumber: 'FR7654321',
        },
        status: BookingStatus.CONFIRMED,
        totalPrice: 6750.0,
        seatNumber: '7B',
      },
      {
        bookingReference: 'BKAA5005',
        flightId: flights[5].id,
        passenger: {
          firstName: 'Carlos',
          lastName: 'Martinez',
          email: 'carlos.martinez@email.com',
          passportNumber: 'US3456789',
        },
        status: BookingStatus.CANCELLED,
        totalPrice: 3200.0,
        seatNumber: '22F',
      },
    ]);
  }
}
