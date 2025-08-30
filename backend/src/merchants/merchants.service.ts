import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  // CORRECTION : On importe NotFoundException depuis `@nestjs/common`
  NotFoundException,
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

    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { userId },
    });

    if (existingMerchant) {
      throw new ConflictException(
        'Cet utilisateur a déjà un profil de commerçant.',
      );
    }

    try {
      // Le reste de votre logique reste inchangé
      const merchant = 'logique de création ici'; // Placeholder
      return merchant;
    } catch (error) {
      console.error('Erreur lors de la création du commerçant:', error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du commerçant.',
      );
    }
  }

  async findMe(userId: string) {
    const merchantProfile = await this.prisma.merchant.findUnique({
      where: { userId },
    });

    if (!merchantProfile) {
      throw new NotFoundException(
        'Profil de commerçant non trouvé pour cet utilisateur.',
      );
    }
    return merchantProfile;
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

    // Votre logique $queryRaw reste inchangée
    const merchants: any[] = await this.prisma.$queryRaw(
      Prisma.sql`SELECT id, name FROM "Merchant"`, // Placeholder
    );
    return merchants;
  }
}
