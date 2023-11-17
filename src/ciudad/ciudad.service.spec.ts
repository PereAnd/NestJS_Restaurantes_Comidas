import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let citiesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    citiesList = [];
    for (let i = 0; i < 5; i++) {
      const city: CiudadEntity = await repository.save({
        name: faker.location.city(),
        country: faker.location.country(),
        population: faker.number.int(),
      });
      citiesList.push(city);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CiudadEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(citiesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CiudadEntity = citiesList[0];
    const city: CiudadEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.id).toEqual(storedCity.id);
    expect(city.name).toEqual(storedCity.name);
    expect(city.country).toEqual(storedCity.country);
    expect(city.population).toEqual(storedCity.population);
  });
  it('findOne should throw an exception when the city does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should create a new city', async () => {
    const city: CiudadEntity = {
      id: '',
      name: faker.location.city(),
      country: faker.location.country(),
      population: faker.number.int(),
      supermarkets: [],
    };

    const newCity: CiudadEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const savedCity: CiudadEntity = await repository.findOne({
      where: { id: newCity.id },
    });
    expect(savedCity).not.toBeNull();
    expect(savedCity.id).toEqual(newCity.id);
    expect(savedCity.name).toEqual(newCity.name);
    expect(savedCity.country).toEqual(newCity.country);
    expect(savedCity.population).toEqual(newCity.population);
  });

  it('update should modify a city', async () => {
    const city: CiudadEntity = citiesList[0];
    city.name = 'Name modified';
    city.country = 'Country modified';
    city.population = 1000;

    const updatedCity: CiudadEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const savedCity: CiudadEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(savedCity).not.toBeNull();
    expect(savedCity.name).toEqual(city.name);
    expect(savedCity.country).toEqual(city.country);
    expect(savedCity.population).toEqual(city.population);
  });

  it('update should throw an exception when the city does not exist', async () => {
    let city: CiudadEntity = citiesList[0];
    city = {
      ...city,
      name: 'Name modified',
      country: 'Country modified',
      population: 1000,
      supermarkets: [],
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const city: CiudadEntity = citiesList[0];
    await service.delete(city.id);
    const deletedCity: CiudadEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception when the city does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
