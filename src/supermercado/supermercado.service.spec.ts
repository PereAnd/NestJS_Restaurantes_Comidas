import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermarketsList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermercadoEntity = await repository.save({
        name: faker.company.name(),
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        webpage: faker.internet.url(),
      });
      supermarketsList.push(supermarket);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermercadoEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketsList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermercadoEntity = supermarketsList[0];
    const supermarket: SupermercadoEntity = await service.findOne(
      storedSupermarket.id,
    );
    expect(supermarket).not.toBeNull();
    expect(supermarket.id).toEqual(storedSupermarket.id);
    expect(supermarket.name).toEqual(storedSupermarket.name);
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude);
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude);
    expect(supermarket.webpage).toEqual(storedSupermarket.webpage);
  });
  it('findOne should throw an exception when the supermarket does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('create should create a new supermarket', async () => {
    const supermarket: SupermercadoEntity = {
      id: '',
      name: faker.company.name(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      webpage: faker.internet.url(),
      cities: [],
    };

    const newSupermarket: SupermercadoEntity =
      await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const savedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermarket.id },
    });
    expect(savedSupermarket).not.toBeNull();
    expect(savedSupermarket.id).toEqual(newSupermarket.id);
    expect(savedSupermarket.name).toEqual(newSupermarket.name);
    expect(savedSupermarket.latitude).toEqual(newSupermarket.latitude);
    expect(savedSupermarket.longitude).toEqual(newSupermarket.longitude);
    expect(savedSupermarket.webpage).toEqual(newSupermarket.webpage);
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];
    supermarket.name = 'Name modified';
    supermarket.latitude = 1000;
    supermarket.longitude = 1000;
    supermarket.webpage = 'webpage modified';

    const updateSupermarket: SupermercadoEntity = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updateSupermarket).not.toBeNull();
    const savedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(savedSupermarket).not.toBeNull();
    expect(savedSupermarket.name).toEqual(supermarket.name);
    expect(savedSupermarket.latitude).toEqual(supermarket.latitude);
    expect(savedSupermarket.longitude).toEqual(supermarket.longitude);
    expect(savedSupermarket.webpage).toEqual(supermarket.webpage);
  });

  it('update should throw an exception when the supermarket does not exist', async () => {
    let supermarket: SupermercadoEntity = supermarketsList[0];
    supermarket = {
      ...supermarket,
      name: 'Name modified',
      longitude: 1000,
      latitude: 1000,
      webpage: 'webpage modified',
      cities: [],
    };
    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermarketsList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: SupermercadoEntity = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception when the supermarket does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
