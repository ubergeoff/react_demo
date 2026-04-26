import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { Flight } from '@flight-booking/models';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll(): Promise<Flight[]> {
    return this.flightsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Flight> {
    const flight = await this.flightsService.findOne(id);
    if (!flight) throw new NotFoundException(`Flight ${id} not found`);
    return flight;
  }
}
