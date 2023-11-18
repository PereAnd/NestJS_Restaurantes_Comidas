import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsIn(['Argentina', 'Ecuador', 'Paraguay'])
  @IsNotEmpty()
  readonly country: string;

  @IsNumber()
  @IsNotEmpty()
  readonly population: number;
}
