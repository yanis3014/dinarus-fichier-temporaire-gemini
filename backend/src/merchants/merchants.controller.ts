import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  // CORRECTION : On importe les exceptions depuis `@nestjs/common`
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { SuggestMerchantDto } from './dto/suggest-merchant.dto';
import { NearbyMerchantsDto } from './dto/nearby-merchants.dto';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.create(req.user.sub, createMerchantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyProfile(@Req() req) {
    const userId = req.user.sub;
    if (!userId) {
      throw new UnauthorizedException(
        'ID utilisateur non trouvé dans le token',
      );
    }
    return this.merchantsService.findMe(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('suggest')
  suggest(@Req() req, @Body() suggestMerchantDto: SuggestMerchantDto) {
    return this.merchantsService.suggest(req.user.sub, suggestMerchantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('suggestions/my')
  findMySuggestions(@Req() req) {
    return this.merchantsService.findMySuggestions(req.user.sub);
  }

  @Get('nearby')
  findNearby(@Query() nearbyMerchantsDto: NearbyMerchantsDto) {
    return this.merchantsService.findNearby(nearbyMerchantsDto);
  }
}
