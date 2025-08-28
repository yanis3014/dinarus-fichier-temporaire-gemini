// dinary-temp/dinarus-backend/src/auth/guards/AdminGuard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // L'objet utilisateur est attaché à la requête par la stratégie JWT

    if (user && user.role === 'ADMIN') {
      // Vérifie le rôle
      return true; // Accès autorisé
    }

    // Si l'utilisateur n'est pas un ADMIN, l'accès est refusé
    return false;
  }
}
