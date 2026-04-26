export enum BookingStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum CabinClass {
  ECONOMY = 'economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  cabinClass: CabinClass;
  availableSeats: number;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  flightId: string;
  flight?: Flight;
  passenger: Passenger;
  status: BookingStatus;
  totalPrice: number;
  seatNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  flightId: string;
  passenger: Passenger;
  seatNumber: string;
  cabinClass: CabinClass;
}

export interface UpdateBookingDto {
  passenger?: Partial<Passenger>;
  status?: BookingStatus;
  seatNumber?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
