// backend/src/wallet/wallet.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Query, // 👈 On importe Query pour lire les paramètres d'URL
  UnauthorizedException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { RechargeDto } from './dto/recharge.dto';
import { SendMoneyDto } from './dto/send-money.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Fonction utilitaire inchangée
  private getUserId(req: any): string {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(
        'ID utilisateur non trouvé dans le token.',
      );
    }
    return userId;
  }

  // --- NOUVELLE ROUTE : pour la recherche d'utilisateurs ---
  @UseGuards(AuthGuard('jwt'))
  @Get('search-user')
  searchUsers(@Request() req, @Query('q') query: string) {
    const userId = this.getUserId(req);
    return this.walletService.searchUsers(query, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyWallet(@Request() req) {
    const userId = this.getUserId(req);
    return this.walletService.findOneByUserId(userId);
  }

  // ... (le reste du fichier est inchangé)
  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  getTransactions(@Request() req) {
    const userId = this.getUserId(req);
    return this.walletService.getTransactions(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('recharge')
  rechargeWallet(@Request() req, @Body() rechargeDto: RechargeDto) {
    const userId = this.getUserId(req);
    return this.walletService.recharge(userId, rechargeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  sendMoney(@Request() req, @Body() sendMoneyDto: SendMoneyDto) {
    const senderUserId = this.getUserId(req);
    return this.walletService.sendMoney(senderUserId, sendMoneyDto);
  }
}
