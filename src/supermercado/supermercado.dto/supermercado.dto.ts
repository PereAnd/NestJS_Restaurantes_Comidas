import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, undefined, {
    message: 'The supermarket name must be at least 10 characters',
  })
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
