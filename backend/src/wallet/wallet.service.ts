// backend/src/wallet/wallet.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMoneyDto } from './dto/send-money.dto';
import { GamificationService } from 'src/gamification/gamification.service';
import { RechargeDto } from './dto/recharge.dto';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  // --- FONCTION DE RECHERCHE DÉFINITIVEMENT CORRIGÉE ---
  async searchUsers(query: string, currentUserId: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    // CORRECTION : La structure de la requête utilise maintenant un `AND` implicite,
    // ce qui est la bonne façon de combiner les conditions dans Prisma.
    return this.prisma.user.findMany({
      where: {
        // Condition 1 : L'ID ne doit pas être celui de l'utilisateur actuel
        id: {
          not: currentUserId,
        },
        // Condition 2 : L'un des champs suivants doit correspondre à la recherche
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        phoneNumber: true,
      },
      take: 10,
    });
  }

  // Le reste du fichier est conservé tel quel.
  async sendMoney(senderUserId: string, sendMoneyDto: SendMoneyDto) {
    const { amount, receiverId } = sendMoneyDto;
    const result = await this.prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderUserId },
      });
      if (!senderWallet)
        throw new NotFoundException("Portefeuille de l'expéditeur non trouvé.");
      if (senderWallet.balance < amount)
        throw new BadRequestException('Solde insuffisant.');

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: receiverId },
      });
      if (!receiverWallet)
        throw new NotFoundException('Portefeuille du destinataire non trouvé.');
      if (senderWallet.id === receiverWallet.id)
        throw new BadRequestException(
          "Vous ne pouvez pas vous envoyer de l'argent à vous-même.",
        );

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      });
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amount } },
      });

      const receiver = await tx.user.findUnique({ where: { id: receiverId } });
      if (!receiver)
        throw new NotFoundException('Utilisateur destinataire introuvable.');

      await tx.transaction.create({
        data: {
          amount,
          type: 'transfer',
          description: `Transfert à ${receiver.username}`,
          senderId: senderWallet.id,
          receiverId: receiverWallet.id,
        },
      });
      return { message: 'Transfert effectué avec succès.' };
    });

    await this.gamificationService.addXp(senderUserId, 10);
    await this.gamificationService.updateMissionProgress(
      senderUserId,
      'SEND_MONEY_5_TIMES',
      1,
    );
    return result;
  }

  async getTransactions(userId: string) {
    const wallet = await this.findOneByUserId(userId);
    if (!wallet) throw new NotFoundException('Portefeuille non trouvé.');
    return this.prisma.transaction.findMany({
      where: { OR: [{ senderId: wallet.id }, { receiverId: wallet.id }] },
      include: {
        sender: {
          select: { user: { select: { username: true, fullName: true } } },
        },
        receiver: {
          select: { user: { select: { username: true, fullName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async recharge(userId: string, rechargeDto: RechargeDto) {
    const { amount } = rechargeDto;
    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } },
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
    let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({ data: { userId } });
    }
    return wallet;
  }
}
