// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
