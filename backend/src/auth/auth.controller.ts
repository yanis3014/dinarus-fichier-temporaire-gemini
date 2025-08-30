// backend/src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterMerchantDto } from './dto/register-merchant.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Gardez seulement cette version de la route de connexion
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register-merchant')
  @HttpCode(HttpStatus.CREATED)
  async registerMerchant(@Body() registerMerchantDto: RegisterMerchantDto) {
    return this.authService.registerMerchant(registerMerchantDto);
  }
}
