// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Veuillez fournir un email valide.' })
  @IsNotEmpty({ message: "L'email ne peut pas être vide." })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom complet ne peut pas être vide.' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: "Le nom d'utilisateur ne peut pas être vide." })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone ne peut pas être vide.' })
  phoneNumber: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  password: string;
}
