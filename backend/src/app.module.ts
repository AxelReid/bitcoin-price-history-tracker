import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitcoinModule } from './routes/bitcoin/bitcoin.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [BitcoinModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
