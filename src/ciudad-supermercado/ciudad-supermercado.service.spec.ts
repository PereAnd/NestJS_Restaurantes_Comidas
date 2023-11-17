import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let city: CiudadEntity;
  let supermarketsList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermercadoEntity = await supermercadoRepository.save(
        {
          name: faker.company.name(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          webpage: faker.internet.url(),
        },
      );
      supermarketsList.push(supermarket);
    }

    city = await ciudadRepository.save({
      name: faker.location.city(),
      country: faker.location.country(),
      population: faker.number.int(),
      supermarkets: supermarketsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an supermarket to a city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    const newCity: CiudadEntity = await ciudadRepository.save({
      name: faker.location.city(),
      country: faker.location.country(),
      population: faker.number.int(),
    });

    const result: CiudadEntity = await service.addSupermarketToCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name);
    expect(result.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(result.supermarkets[0].longitude).toBe(newSupermarket.longitude);
    expect(result.supermarkets[0].webpage).toBe(newSupermarket.webpage);
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CiudadEntity = await ciudadRepository.save({
      name: faker.company.name(),
      country: faker.location.country(),
      population: faker.number.int(),
    });

    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    await expect(() =>
      service.addSupermarketToCity('0', newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];
    const storedSupermarket: SupermercadoEntity =
      await service.findSupermarketFromCity(city.id, supermarket.id);
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toBe(supermarket.name);
    expect(storedSupermarket.latitude).toBe(supermarket.latitude);
    expect(storedSupermarket.longitude).toBe(supermarket.longitude);
    expect(storedSupermarket.webpage).toBe(supermarket.webpage);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    await expect(() =>
      service.findSupermarketFromCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('findSupermarketsFromCity should return supermarkets by city', async () => {
    const supermarkets: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(city.id);
    expect(supermarkets.length).toBe(5);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should update supermarkets list for a city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    const updatedCity: CiudadEntity = await service.updateSupermarketsFromCity(
      city.id,
      [newSupermarket],
    );
    expect(updatedCity.supermarkets.length).toBe(1);
    expect(updatedCity.supermarkets[0].name).toBe(newSupermarket.name);
    expect(updatedCity.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(updatedCity.supermarkets[0].longitude).toBe(
      newSupermarket.longitude,
    );
    expect(updatedCity.supermarkets[0].webpage).toBe(newSupermarket.webpage);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    await expect(() =>
      service.updateSupermarketsFromCity('0', [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarket: SupermercadoEntity = supermarketsList[0];
    newSupermarket.id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(city.id, [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should remove an supermarket from a city', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];

    await service.deleteSupermarketFromCity(city.id, supermarket.id);

    const storedCity: CiudadEntity = await ciudadRepository.findOne({
      where: { id: city.id },
      relations: ['supermarkets'],
    });
    const deletedArtwork: SupermercadoEntity = storedCity.supermarkets.find(
      (a) => a.id === supermarket.id,
    );

    expect(deletedArtwork).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermercadoEntity =
      await supermercadoRepository.save({
        name: faker.company.name(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        webpage: faker.internet.url(),
      });

    await expect(() =>
      service.deleteSupermarketFromCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });
});
