import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';

@Injectable()
export class PriceCollectorService implements OnModuleInit {
  private readonly logger = new Logger(PriceCollectorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    await this.seedInitialData();

    // register cron job after initial seed finishs
    const job = new CronJob('0 * * * * *', () => {
      this.collectPriceData();
    });
    this.schedulerRegistry.addCronJob('bitcoin-price-collector', job);
    job.start();
  }

  async collectPriceData() {
    try {
      this.logger.log('Starting Bitcoin price collection...');

      // Fetch from Coinbase API
      const response = await axios.get(
        'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
      );

      const price = parseFloat(response.data.data.rates.USD);

      await this.prisma.bitcoinPrice.create({
        data: {
          price,
          source: 'coinbase',
        },
      });

      this.logger.log(`Successfully collected Bitcoin price: $${price}`);
    } catch (error) {
      this.logger.error('Failed to collect Bitcoin price:', error.message);
    }
  }

  // Seed initial data of last 365 days
  async seedInitialData() {
    try {
      const existingCount = await this.prisma.bitcoinPrice.count();

      if (existingCount > 0) {
        this.logger.log('Data already exists, skipping seed');
        return;
      }

      this.logger.log('Seeding initial Bitcoin price data...');

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
        {
          params: {
            vs_currency: 'usd',
            days: 365,
            interval: 'daily',
          },
        },
      );

      const prices = response.data.prices.map(([timestamp, price]) => ({
        price: Math.round(price * 100) / 100,
        timestamp: new Date(timestamp),
        source: 'coingecko',
      }));

      await this.prisma.bitcoinPrice.createMany({
        data: prices,
      });

      this.logger.log(`Seeded ${prices.length} initial Bitcoin price records`);
    } catch (error) {
      this.logger.error('Failed to seed initial data:', error.message);
    }
  }
}
