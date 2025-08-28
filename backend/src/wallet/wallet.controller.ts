import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { RechargeDto } from './dto/recharge.dto';
import { SendMoneyDto } from './dto/send-money.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyWallet(@Request() req) {
    const userId = req.user.userId;
    return this.walletService.findOneByUserId(userId);
  }

  // Nouvelle route pour l'historique des transactions
  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  getTransactions(@Request() req) {
    const userId = req.user.userId;
    return this.walletService.getTransactions(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('recharge')
  rechargeWallet(@Request() req, @Body() rechargeDto: RechargeDto) {
    const userId = req.user.userId;
    return this.walletService.recharge(userId, rechargeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  sendMoney(@Request() req, @Body() sendMoneyDto: SendMoneyDto) {
    const senderUserId = req.user.userId;
    return this.walletService.sendMoney(senderUserId, sendMoneyDto);
  }
}
