import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '@flight-booking/models';
import { FlightEntity } from '../flights/flight.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingReference: string;

  @Column()
  flightId: string;

  @ManyToOne(() => FlightEntity, (flight) => flight.bookings, { eager: true })
  @JoinColumn({ name: 'flightId' })
  flight: FlightEntity;

  @Column({ type: 'jsonb' })
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    passportNumber: string;
  };

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  seatNumber: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
