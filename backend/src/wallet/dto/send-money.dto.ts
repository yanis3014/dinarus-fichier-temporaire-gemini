import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class SendMoneyDto {
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @IsPositive({ message: 'Le montant doit être positif.' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: "Le nom d'utilisateur du destinataire est requis." })
  receiverUsername: string;
}
