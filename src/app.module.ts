import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from './modules/ConfigModule';
import { BalanceModule } from './modules/BalanceModule';
import { DatabaseModule } from './modules/DatabaseModule';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    BalanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
