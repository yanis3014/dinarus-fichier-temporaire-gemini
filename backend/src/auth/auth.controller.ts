// dinary-temp/dinarus-backend/src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterMerchantDto } from './dto/register-merchant.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    // Le décorateur @Body() est crucial
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // MODIFIÉ : On envoie l'objet entier `loginDto`
    return this.authService.signIn(loginDto);
  }
}
