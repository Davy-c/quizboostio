import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceController } from '../controllers/BalanceController';
import { BalanceService } from '../services/BalanceService';

import { Balance } from '../entities/Balance.entity';
import { Deposit } from '../entities/Deposit.entity';
import { Withdraw } from '../entities/Withdraw.entity';
import { Transfer } from '../entities/Transfer.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Balance]),
    TypeOrmModule.forFeature([Deposit]),
    TypeOrmModule.forFeature([Withdraw]),
    TypeOrmModule.forFeature([Transfer]),
  ],
  controllers: [
    BalanceController,
  ],
  providers: [
    BalanceService,
  ],
})
export class BalanceModule {}