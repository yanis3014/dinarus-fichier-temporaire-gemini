// dinarus-backend/src/gamification/gamification.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { LEVEL_THRESHOLDS } from './level.constants';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // --- Logique d'XP et de Niveaux ---
  async addXp(userId: string, xp: number) {
    const profile = await this.getProfile(userId); // CORRIGÉ : Utilise la bonne fonction
    if (!profile) {
      throw new NotFoundException('Profil utilisateur non trouvé');
    }

    const newXp = profile.xp + xp;
    const newLevel = this.calculateLevel(newXp);

    return this.prisma.userProfile.update({
      where: { userId },
      data: { xp: newXp, level: newLevel },
    });
  }

  calculateLevel(xp: number): number {
    // CORRIGÉ : Convertit l'objet en tableau pour utiliser .length
    const levels = Object.values(LEVEL_THRESHOLDS);
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i]) {
        return i + 2; // Les niveaux commencent à 1, l'index à 0
      }
    }
    return 1;
  }

  // --- Fonctions de base du profil ---
  async getProfile(userId: string) {
    let profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      console.log(
        `Aucun profil trouvé pour l'utilisateur ${userId}, création en cours...`,
      );
      profile = await this.prisma.userProfile.create({
        data: { userId },
      });
    }
    return profile;
  }

  // NOUVEAU : Fonction pour lister les missions d'un utilisateur
  async listUserMissions(userId: string) {
    const profile = await this.getProfile(userId);
    return this.prisma.userMission.findMany({
      where: { userProfileId: profile.id },
      include: { mission: true },
    });
  }
  // NOUVEAU : Fonction pour mettre à jour la progression d'une mission
  async updateMissionProgress(
    userId: string,
    missionType: string,
    progressToAdd: number,
  ) {
    const profile = await this.getProfile(userId);

    // Logique à implémenter pour trouver la mission et mettre à jour la progression
    console.log(
      `Mise à jour de la mission ${missionType} pour l'utilisateur ${userId}`,
    );
    return { success: true };
  }

  async getLeaderboard() {
    return this.prisma.userProfile.findMany({
      orderBy: {
        xp: 'desc',
      },
      take: 10,
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async grantBadge(userId: string, badgeName: string) {
    // CORRECTION ICI : Remplacé getUserProfile par getProfile
    const profile = await this.getProfile(userId);
    // Logique pour ajouter un badge...
    // Exemple :
    // return this.prisma.badge.create({ data: { name: badgeName, userProfileId: profile.id }});
    console.log(`Badge ${badgeName} accordé à l'utilisateur ${userId}`);
    return { success: true };
  }
}
