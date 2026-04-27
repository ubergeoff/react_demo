import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
} from '@flight-booking/models';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    const booking = await this.bookingsService.findOne(id);
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  @Post()
  async create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}
