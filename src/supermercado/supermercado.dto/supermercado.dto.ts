import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly latitude: number;

  @IsNumber()
  @IsNotEmpty()
  readonly longitude: number;

  @IsUrl()
  @IsNotEmpty()
  readonly webpage: string;
}
