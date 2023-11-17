import { Injectable } from '@nestjs/common';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find({ relations: ['cities'] });
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const city: SupermercadoEntity = await this.supermercadoRepository.findOne({
      where: { id },
      relations: ['cities'],
    });
    if (!city) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return city;
  }

  async create(ciudad: SupermercadoEntity): Promise<SupermercadoEntity> {
    return await this.supermercadoRepository.save(ciudad);
  }

  async update(
    id: string,
    supermarket: SupermercadoEntity,
  ): Promise<SupermercadoEntity> {
    const savedSupermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!savedSupermarket) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.supermercadoRepository.save({
      ...savedSupermarket,
      ...supermarket,
    });
  }

  async delete(id: string) {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id },
      });
    if (!supermarket) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.supermercadoRepository.remove(supermarket);
  }
}
