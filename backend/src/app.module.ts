import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MerchantsModule } from './merchants/merchants.module';
import { RequestsModule } from './requests/requests.module';
import { WalletModule } from './wallet/wallet.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MerchantsModule,
    RequestsModule,
    WalletModule,
    GamificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
