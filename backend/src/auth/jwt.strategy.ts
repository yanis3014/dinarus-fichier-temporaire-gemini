// dinary-temp/dinarus-backend/src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // Vérification explicite : si le secret n'existe pas, on lève une erreur claire.
    if (!secret) {
      throw new UnauthorizedException('La clé secrète JWT est manquante.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Utiliser la variable "secret" qui est maintenant garantie d'être un string
    });
  }

  async validate(payload: any) {
    // Le `payload` contient les données que nous avons signées dans `auth.service.ts`
    // On peut s'en servir pour récupérer l'utilisateur dans la base de données si besoin
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
