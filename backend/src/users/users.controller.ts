// dinary-temp/dinarus-backend/src/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/AdminGuard';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Ajout de la garde au niveau du contrôleur pour protéger toutes les routes
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    // Cette fonction va maintenant retourner { userId, username, role }
    return req.user;
  }

  // 👈 CONSERVE SEULEMENT CETTE VERSION
  @Get('all')
  @UseGuards(AdminGuard) // 👈 La garde d'admin est suffisante car la garde JWT est sur le contrôleur
  async findAll(@Request() req) {
    return this.usersService.findAll(req.user.id);
  }

  // 👇 AJOUTEZ CETTE NOUVELLE ROUTE ICI 👇
  @UseGuards(AuthGuard('jwt')) // Protégée, seul un utilisateur connecté peut chercher
  @Get('search')
  search(@Query('q') query: string, @Request() req) {
    const currentUserId = req.user.sub; // On récupère l'ID de l'utilisateur qui cherche
    return this.usersService.searchUsers(query, currentUserId);
  }
}
