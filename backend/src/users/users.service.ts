import {
  Injectable,
  ConflictException,
  NotFoundException, // 👈 Ajout de cet import
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({ data });
        await tx.wallet.create({ data: { userId: user.id } });
        await tx.userProfile.create({ data: { userId: user.id } });
        return user;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Un utilisateur avec ces informations existe déjà.',
        );
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.'); // La classe est maintenant reconnue
    }
    return user;
  }

  async searchUsers(query: string, currentUserId: string) {
    if (!query || query.trim().length < 2) {
      // On ne renvoie rien si la recherche est trop courte pour des raisons de performance
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId, // Exclut l'utilisateur actuel des résultats
            },
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: 'insensitive', // Ignore la casse (majuscules/minuscules)
                },
              },
              {
                fullName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        phoneNumber: true, // <--- AJOUTEZ CETTE LIGNE
      },
      take: 10, // On limite le nombre de résultats
    });
  }

  async findAll(excludeUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: excludeUserId,
        },
      },
      select: {
        id: true,
        fullName: true,
        username: true,
      },
    });
  }
}
