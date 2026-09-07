import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  @MaxLength(20, { message: 'Le nom ne peut pas dépasser 20 caractères' })
  name: string;
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;
  @IsOptional()
  @IsEnum(['admin', 'user'], { message: "Le rôle doit être 'admin' ou 'user'" })
  role?: 'admin' | 'user';
}
