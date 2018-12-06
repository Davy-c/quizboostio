import { Balance } from '../entities/Balance.entity';
import { Deposit } from '../entities/Deposit.entity';
import { Transfer } from '../entities/Transfer.entity';
import { Withdraw } from '../entities/Withdraw.entity';
import { getManager } from 'typeorm';

export interface BalanceServiceInterface {
    validAmount(amount: string | number): string;
    createBalance(initialAmount: string | number): Promise<Balance>;
    getBalance(balanceId: string): Promise<Balance>;
    getBalances(): Promise<Balance[]>;
}