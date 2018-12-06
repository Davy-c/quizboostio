import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ConfigModule } from './modules/ConfigModule';
import { BalanceModule } from './modules/BalanceModule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BalanceController } from './controllers/BalanceController';
import { BalanceService } from './services/BalanceService';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule,
    BalanceModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
