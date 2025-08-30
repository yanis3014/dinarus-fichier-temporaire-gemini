// backend/src/gamification/gamification.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // On s'assure que req.user et req.user.sub existent.
    const userId = req.user?.sub;

    if (!userId) {
      // Si on ne trouve pas d'ID, c'est une erreur d'authentification
      throw new UnauthorizedException(
        "Impossible de trouver l'ID utilisateur dans le token.",
      );
    }

    // On passe l'ID de l'utilisateur au service.
    return this.gamificationService.getProfile(userId);
  }
}
