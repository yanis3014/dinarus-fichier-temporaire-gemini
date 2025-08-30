// backend/src/wallet/dto/send-money.dto.ts

import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class SendMoneyDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  // CORRECTION : On attend maintenant un ID, pas un nom d'utilisateur.
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}
