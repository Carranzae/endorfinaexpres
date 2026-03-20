import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.complaintsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.complaintsService.updateStatus(id, status);
  }
}
