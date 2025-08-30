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
  NotFoundException, // Importer NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/AdminGuard';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    const userId = req.user.sub;
    const user = await this.usersService.findOneById(userId);

    // --- CORRECTION ICI ---
    // On vérifie si l'utilisateur a bien été trouvé avant de continuer.
    if (!user) {
      // Même si le service le fait déjà, cette vérification est une bonne pratique
      // et elle satisfait le compilateur TypeScript.
      throw new NotFoundException(
        `Utilisateur avec l'ID ${userId} non trouvé.`,
      );
    }

    // Maintenant que TypeScript sait que 'user' ne peut pas être 'null',
    // cette ligne ne posera plus de problème.
    const { hashedPassword, ...result } = user;
    return result;
  }

  // ... (le reste de ton contrôleur reste inchangé)
  @Get('all')
  @UseGuards(AdminGuard)
  async findAll(@Request() req) {
    return this.usersService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  search(@Query('q') query: string, @Request() req) {
    const currentUserId = req.user.sub;
    return this.usersService.searchUsers(query, currentUserId);
  }
}
