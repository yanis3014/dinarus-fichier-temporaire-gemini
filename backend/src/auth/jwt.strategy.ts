// backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;

    // On vérifie que la clé secrète existe bien.
    if (!jwtSecret) {
      throw new Error("La variable d'environnement JWT_SECRET est manquante.");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // On utilise notre variable vérifiée
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token invalide ou corrompu.');
    }
    // Ce que cette fonction retourne sera placé dans `req.user`
    return {
      sub: payload.sub, // 'sub' est l'ID de l'utilisateur
      username: payload.username,
      role: payload.role,
    };
  }
}
