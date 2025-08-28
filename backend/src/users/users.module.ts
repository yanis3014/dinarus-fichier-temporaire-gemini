import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // La ligne ci-dessous est cruciale !
  exports: [UsersService], // Assurez-vous que cette ligne est présente
})
export class UsersModule {}
