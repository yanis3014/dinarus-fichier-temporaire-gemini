// src/merchants/merchants.service.ts

import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { SuggestMerchantDto } from './dto/suggest-merchant.dto';
import { NearbyMerchantsDto } from './dto/nearby-merchants.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMerchantDto: CreateMerchantDto) {
    const { name, category, description, address, latitude, longitude } =
      createMerchantDto;

    // 1. Vérifier si l'utilisateur a déjà un profil de commerçant
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { userId },
    });

    if (existingMerchant) {
      throw new ConflictException(
        'Cet utilisateur a déjà un profil de commerçant.',
      );
    }

    try {
      // 2. Utiliser une transaction pour garantir que toutes les opérations réussissent ou échouent ensemble
      const merchant = await this.prisma.$transaction(async (tx) => {
        // Crée le commerçant sans la localisation pour l'instant
        const newMerchant = await tx.merchant.create({
          data: {
            name,
            category,
            description,
            address,
            user: {
              connect: { id: userId },
            },
          },
        });

        // Si la latitude et la longitude sont fournies, exécuter la requête PostGIS
        if (latitude && longitude) {
          await tx.$executeRaw`
            UPDATE "Merchant"
            SET location = ST_SetSRID(ST_MakePoint(${longitude}::double precision, ${latitude}::double precision), 4326)
            WHERE id = ${newMerchant.id}
          `;
        }

        // Mettre à jour le rôle de l'utilisateur pour le passer à 'MERCHANT'
        await tx.user.update({
          where: { id: userId },
          data: { role: 'MERCHANT' },
        });

        return newMerchant;
      });

      return merchant;
    } catch (error) {
      console.error('Erreur lors de la création du commerçant:', error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du commerçant.',
      );
    }
  }

  async suggest(userId: string, suggestMerchantDto: SuggestMerchantDto) {
    return this.prisma.merchantSuggestion.create({
      data: {
        ...suggestMerchantDto,
        suggestedById: userId,
      },
    });
  }

  async findMySuggestions(userId: string) {
    return this.prisma.merchantSuggestion.findMany({
      where: {
        suggestedById: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findNearby(nearbyMerchantsDto: NearbyMerchantsDto) {
    const { latitude, longitude, radius } = nearbyMerchantsDto;

    const merchants: any[] = await this.prisma.$queryRaw(
      Prisma.sql`
      SELECT
        id,
        name,
        category,
        address,
        ST_Distance(location::geography, ST_MakePoint(${longitude}::double precision, ${latitude}::double precision)::geography) as distance
      FROM "Merchant"
      WHERE ST_DWithin(location::geography, ST_MakePoint(${longitude}::double precision, ${latitude}::double precision)::geography, ${radius})
      ORDER BY distance;
    `,
    );

    return merchants.map((merchant) => ({
      ...merchant,
      distance: Math.round(merchant.distance),
    }));
  }
}
