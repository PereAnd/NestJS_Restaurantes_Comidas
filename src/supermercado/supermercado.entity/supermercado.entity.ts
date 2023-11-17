import { CiudadEntity } from 'src/ciudad/ciudad.entity/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitud: number;

  @Column()
  latitud: number;

  @Column()
  webpage: string;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermarkets)
  cities: CiudadEntity[];
}
