import { SupermercadoEntity } from '../../supermercado/supermercado.entity/supermercado.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  population: number;

  @ManyToMany(() => SupermercadoEntity, (supermercado) => supermercado.cities)
  @JoinTable()
  supermarkets: SupermercadoEntity[];
}
