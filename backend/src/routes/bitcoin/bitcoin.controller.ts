import { Controller, Get, Query } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';

@Controller('bitcoin')
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @Get('prices')
  async getPrices(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bitcoinService.getPrices(period, startDate, endDate);
  }

  @Get('latest')
  async getLatestPrice() {
    return this.bitcoinService.getLatestPrice();
  }

  @Get('stats')
  async getStats(@Query('period') period?: string) {
    return this.bitcoinService.getStats(period);
  }
}
