import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsNumber()
  @IsNotEmpty()
  readonly population: number;
}
