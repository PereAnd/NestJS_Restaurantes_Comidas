import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async addSupermarketToCity(
    cityId: string,
    supermarketId: string,
  ): Promise<CiudadEntity> {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermarketId },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    city.supermarkets = [...city.supermarkets, supermarket];
    return await this.ciudadRepository.save(city);
  }

  async findSupermarketsFromCity(
    cityId: string,
  ): Promise<SupermercadoEntity[]> {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return city.supermarkets;
  }

  async findSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<SupermercadoEntity> {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermarketId },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const citySupermarket: SupermercadoEntity = city.supermarkets.find(
      (e) => e.id === supermarket.id,
    );

    if (!citySupermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );

    return citySupermarket;
  }

  async updateSupermarketsFromCity(
    cityId: string,
    supermarkets: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });

    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < supermarkets.length; i++) {
      const supermarket: SupermercadoEntity =
        await this.supermercadoRepository.findOne({
          where: { id: supermarkets[i].id },
        });
      if (!supermarket)
        throw new BusinessLogicException(
          'The supermarket with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    city.supermarkets = supermarkets;
    return await this.ciudadRepository.save(city);
  }

  async deleteSupermarketFromCity(cityId: string, supermarketId: string) {
    const supermarket: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermarketId },
      });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const citySupermarket: SupermercadoEntity = city.supermarkets.find(
      (e) => e.id === supermarket.id,
    );

    if (!citySupermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id is not associated to the city',
        BusinessError.PRECONDITION_FAILED,
      );

    city.supermarkets = city.supermarkets.filter((e) => e.id !== supermarketId);
    await this.ciudadRepository.save(city);
  }
}
