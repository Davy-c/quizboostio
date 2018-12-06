import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceController } from '../controllers/BalanceController';
import { BalanceService } from '../services/BalanceService';

import { Balance } from '../entities/Balance.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Balance]),
  ],
  controllers: [
    BalanceController,
  ],
  providers: [
    BalanceService,
  ],
})
export class BalanceModule {}