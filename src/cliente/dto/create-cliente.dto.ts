import { IsString, IsEmail, MinLength, IsNumber, Min } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  apellido: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(10)
  telefono: number;
}
