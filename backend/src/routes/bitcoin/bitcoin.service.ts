import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BitcoinService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrices(period?: string, startDate?: string, endDate?: string) {
    let where: any = {};

    const now = new Date();

    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (period) {
      const periodMap = {
        day: 1,
        week: 7,
        month: 30,
        year: 365,
      };

      const days = periodMap[period] || 7;
      const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      where.timestamp = {
        gte: startTime,
      };
    }

    const prices = await this.prisma.bitcoinPrice.findMany({
      where,
      orderBy: {
        timestamp: 'asc',
      },
    });

    return {
      data: prices,
      count: prices.length,
    };
  }

  async getLatestPrice() {
    const latest = await this.prisma.bitcoinPrice.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });

    return latest;
  }

  async getStats(period?: string) {
    const now = new Date();
    let startTime: Date;

    switch (period) {
      case 'day':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const prices = await this.prisma.bitcoinPrice.findMany({
      where: {
        timestamp: {
          gte: startTime,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    if (prices.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        first: 0,
        last: 0,
        change: 0,
        changePercent: 0,
      };
    }

    const priceValues = prices.map((p) => p.price);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const avg = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    const first = prices[0].price;
    const last = prices[prices.length - 1].price;
    const change = last - first;
    const changePercent = (change / first) * 100;

    return {
      min,
      max,
      avg: Math.round(avg * 100) / 100,
      first,
      last,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  }
}
