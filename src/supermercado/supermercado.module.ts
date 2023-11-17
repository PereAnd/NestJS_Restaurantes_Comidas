import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity/supermercado.entity';
import { SupermercadoController } from './supermercado.controller';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  controllers: [SupermercadoController],
})
export class SupermercadoModule {}
