import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name?: string;
}
// Este DTO se utiliza para crear un nuevo usuario.
// Incluye validaciones para el email y la contraseña.