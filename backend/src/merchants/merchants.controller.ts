import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // <--- IMPORTE AuthGuard ICI
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { SuggestMerchantDto } from './dto/suggest-merchant.dto';
import { NearbyMerchantsDto } from './dto/nearby-merchants.dto';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  // CORRECTION : Utilise AuthGuard('jwt')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() createMerchantDto: CreateMerchantDto) {
    // req.user contient le payload du token, y compris userId
    return this.merchantsService.create(req.user.userId, createMerchantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('suggest')
  suggest(@Req() req, @Body() suggestMerchantDto: SuggestMerchantDto) {
    return this.merchantsService.suggest(req.user.userId, suggestMerchantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('suggestions/my')
  findMySuggestions(@Req() req) {
    return this.merchantsService.findMySuggestions(req.user.userId);
  }

  @Get('nearby')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findNearby(@Query() nearbyMerchantsDto: NearbyMerchantsDto) {
    return this.merchantsService.findNearby(nearbyMerchantsDto);
  }
}
