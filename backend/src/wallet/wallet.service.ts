import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RechargeDto } from './dto/recharge.dto';
import { SendMoneyDto } from './dto/send-money.dto';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  async sendMoney(senderUserId: string, sendMoneyDto: SendMoneyDto) {
    const { amount, receiverUsername } = sendMoneyDto;

    // La transaction se concentre uniquement sur les opérations financières
    const result = await this.prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderUserId },
      });

      if (!senderWallet) {
        throw new NotFoundException("Portefeuille de l'expéditeur non trouvé.");
      }

      const receiver = await tx.user.findUnique({
        where: { username: receiverUsername },
        include: { wallet: true },
      });

      if (!receiver || !receiver.wallet) {
        throw new NotFoundException('Utilisateur destinataire non trouvé.');
      }

      const receiverWallet = receiver.wallet;

      if (senderWallet.id === receiverWallet.id) {
        throw new BadRequestException(
          "Vous ne pouvez pas vous envoyer de l'argent à vous-même.",
        );
      }

      if (senderWallet.balance < amount) {
        throw new BadRequestException('Solde insuffisant.');
      }

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          amount,
          type: 'transfer',
          description: `Transfert à ${receiverUsername}`,
          senderId: senderWallet.id,
          receiverId: receiverWallet.id,
        },
      });

      return { message: 'Transfert effectué avec succès.' };
    });

    // Une fois la transaction terminée avec succès, on ajoute l'XP
    await this.gamificationService.addXp(senderUserId, 10); // On donne 10 XP pour un envoi
    await this.gamificationService.updateMissionProgress(
      senderUserId,
      'SEND_MONEY_5_TIMES',
      1,
    );
    return result;
  }
  async getTransactions(userId: string) {
    const wallet = await this.findOneByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Portefeuille non trouvé.');
    }

    return this.prisma.transaction.findMany({
      where: {
        OR: [{ senderId: wallet.id }, { receiverId: wallet.id }],
      },
      include: {
        // 👈 AJOUT IMPORTANT : Inclure les informations liées
        sender: {
          select: {
            user: {
              select: {
                username: true,
                fullName: true,
              },
            },
          },
        },
        receiver: {
          select: {
            user: {
              select: {
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  async recharge(userId: string, rechargeDto: RechargeDto) {
    const { amount } = rechargeDto;

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          amount,
          type: 'recharge',
          description: 'Recharge du compte',
          receiverId: updatedWallet.id,
        },
      });

      return updatedWallet;
    });
  }

  async findOneByUserId(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!wallet) {
      // C'est normal si le wallet n'est pas trouvé immédiatement après création
      // On en crée un pour l'utilisateur
      return this.prisma.wallet.create({
        data: {
          userId: userId,
        },
      });
    }

    return wallet;
  }
}
