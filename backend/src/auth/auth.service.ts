// backend/src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterMerchantDto } from './dto/register-merchant.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.createUser({
      ...rest,
      hashedPassword: hashedPassword,
    });

    const { hashedPassword: _, ...result } = user;
    return result;
  }

  // --- FONCTION CORRIGÉE ---
  async registerMerchant(registerMerchantDto: RegisterMerchantDto) {
    const { name, address, category, ...userData } = registerMerchantDto;

    const existingUser = await this.usersService.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.$transaction(async (tx) => {
      // CORRECTION : On retire le mot de passe en clair (`password`) des données
      // avant de les envoyer à la base de données.
      const { password, ...restUserData } = userData;

      const user = await tx.user.create({
        data: {
          ...restUserData, // On utilise les données sans le mot de passe en clair
          hashedPassword: hashedPassword, // On ajoute le mot de passe chiffré
          role: 'MERCHANT',
        },
      });

      const merchant = await tx.merchant.create({
        data: {
          userId: user.id,
          name,
          address,
          category,
        },
      });

      // On retire le mot de passe chiffré de la réponse pour la sécurité
      const { hashedPassword: _, ...userResult } = user;
      return { user: userResult, merchant };
    });
  }
}
