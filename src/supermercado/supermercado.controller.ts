import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoDto } from './supermercado.dto/supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { plainToInstance } from 'class-transformer';

@Controller('supermarkets')
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermarketId: string) {
    return await this.supermercadoService.findOne(supermarketId);
  }

  @Post()
  async create(@Body() supermarketDto: SupermercadoDto) {
    const supermarket: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermarketDto,
    );
    return await this.supermercadoService.create(supermarket);
  }

  @Put(':supermarketId')
  async update(
    @Param('supermarketId') supermarketId: string,
    @Body() supermarketDto: SupermercadoDto,
  ) {
    const supermarket: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermarketDto,
    );
    return await this.supermercadoService.update(supermarketId, supermarket);
  }
  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermercadoService.delete(supermarketId);
  }
}
