import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigModule } from './modules/ConfigModule';
import { BalanceModule } from './modules/BalanceModule';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule,
    BalanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
