import { Balance } from '../entities/Balance.entity';
import { Deposit } from '../entities/Deposit.entity';
import { Transfer } from '../entities/Transfer.entity';
import { Withdraw } from '../entities/Withdraw.entity';
import { getManager } from 'typeorm';

export interface BalanceServiceInterface {
    validNumber(amount: string | number, type: string): string;
    createBalance(initialAmount: string | number): Promise<Balance>;
    getBalance(balanceId: string | number): Promise<Balance>;
    getBalances(): Promise<Balance[]>;
    createDeposit(balanceId: string | number, amount: string | number): Promise<Deposit>;
    getDeposit(depositId: string | number): Promise<Deposit>;
    getDeposits(): Promise<Deposit[]>;
    createWithdraw(balanceId: string | number, amount: string | number): Promise<Withdraw>;
    getWithdraw(withdrawId: string | number): Promise<Withdraw>;
    getWithdraws(): Promise<Withdraw[]>;
}