import { Balance } from '../entities/Balance.entity';
import { Deposit } from '../entities/Deposit.entity';
import { Transfer } from '../entities/Transfer.entity';
import { Withdraw } from '../entities/Withdraw.entity';
import { getManager } from 'typeorm';

export interface BalanceServiceInterface {
    validNumber(amount: string | number, type: string): string;
    createBalance(initialAmount: string | number): Promise<Balance>;
    getBalance(balanceId: string): Promise<Balance>;
    getBalances(): Promise<Balance[]>;
    createDeposit(balanceId: string, amount: string | number): Promise<Deposit>;
    getDeposit(depositId: string): Promise<Deposit>;
    getDeposits(): Promise<Deposit[]>;
}