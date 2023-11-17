import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto/ciudad.dto';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':cityId')
  async findOne(@Param('cityId') cityId: string) {
    return await this.ciudadService.findOne(cityId);
  }

  @Post()
  async create(@Body() cityDto: CiudadDto) {
    const city: CiudadEntity = plainToInstance(CiudadEntity, cityDto);
    return await this.ciudadService.create(city);
  }

  @Put(':cityId')
  async update(@Param('cityId') cityId: string, @Body() cityDto: CiudadDto) {
    const city: CiudadEntity = plainToInstance(CiudadEntity, cityDto);
    return await this.ciudadService.update(cityId, city);
  }
  @Delete(':cityId')
  @HttpCode(204)
  async delete(@Param('cityId') cityId: string) {
    return await this.ciudadService.delete(cityId);
  }
}
