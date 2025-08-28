import { IsNumber, IsPositive } from 'class-validator';

export class RechargeDto {
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @IsPositive({ message: 'Le montant doit être positif.' })
  amount: number;
}
