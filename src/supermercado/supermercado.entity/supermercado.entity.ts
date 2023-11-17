import { CiudadEntity } from '../../ciudad/ciudad.entity/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column()
  webpage: string;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermarkets)
  cities: CiudadEntity[];
}
