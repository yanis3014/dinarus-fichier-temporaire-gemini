import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const userId = req.user.sub;
    return this.gamificationService.getProfile(userId);
  }

  @Get('missions')
  @UseGuards(AuthGuard('jwt'))
  listMissions(@Request() req) {
    const userId = req.user.sub;
    // CORRIGÉ : Assurez-vous que cette ligne appelle la bonne fonction
    return this.gamificationService.listUserMissions(userId);
  }
}
