import { IsString, IsEmail, MinLength, Matches, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  apellido: string;  

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[0-9]+$/, {message: 'Teléfono solo debe contener numeros'} )
  @MinLength(10) 
  @MaxLength(15)
  telefono: string;
}
