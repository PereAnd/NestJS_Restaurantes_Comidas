import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({ relations: ['supermarkets'] });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return city;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, city: CiudadEntity): Promise<CiudadEntity> {
    const savedCity: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!savedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.ciudadRepository.save({ ...savedCity, ...city });
  }

  async delete(id: string) {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!city) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.ciudadRepository.remove(city);
  }
}
