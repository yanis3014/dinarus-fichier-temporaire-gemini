// src/auth/auth.service.ts

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

    // CORRECTION 1 : Utiliser hashedPassword
    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const payload = { username: user.username, sub: user.id, role: user.role }; // Ajout du rôle dans le token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.createUser({
      ...rest,
      email,
      // CORRECTION 2 : Utiliser hashedPassword
      hashedPassword: hashedPassword,
    });

    // CORRECTION 3 : Utiliser hashedPassword
    const { hashedPassword: _, ...result } = user; // Renommé pour la déstructuration
    return result;
  }

  async registerMerchant(registerMerchantDto: RegisterMerchantDto) {
    const { name, address, category, ...userData } = registerMerchantDto;

    const existingUser = await this.usersService.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          // CORRECTION 4 : Utiliser hashedPassword
          hashedPassword: hashedPassword,
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

      return { user, merchant };
    });
  }
}
