import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CabinClass } from '@flight-booking/models';
import { BookingEntity } from '../bookings/booking.entity';

@Entity('flights')
export class FlightEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  flightNumber: string;

  @Column()
  airline: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamptz' })
  departureTime: Date;

  @Column({ type: 'timestamptz' })
  arrivalTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: CabinClass, default: CabinClass.ECONOMY })
  cabinClass: CabinClass;

  @Column({ default: 180 })
  availableSeats: number;

  @OneToMany(() => BookingEntity, (booking) => booking.flight)
  bookings: BookingEntity[];

  bookingCount?: number;
}
