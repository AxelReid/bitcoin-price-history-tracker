import { Module } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { BitcoinController } from './bitcoin.controller';
import { PrismaService } from 'src/prisma.service';
import { PriceCollectorService } from './price-collector.service';

@Module({
  controllers: [BitcoinController],
  providers: [BitcoinService, PriceCollectorService, PrismaService],
})
export class BitcoinModule {}
