import { Injectable, Inject, Res, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { BalanceServiceInterface } from '../interfaces/BalanceServiceInterface';
import { Balance } from 'src/entities/Balance.entity';
import { Deposit } from 'src/entities/Deposit.entity';
import { Withdraw } from 'src/entities/Withdraw.entity';
import { Transfer } from 'src/entities/Transfer.entity';

@Injectable()
export class BalanceService implements BalanceServiceInterface {
    constructor(
        @InjectRepository(Balance) private readonly balanceRepository: Repository<Balance>,
        @InjectRepository(Deposit) private readonly depositRepository: Repository<Deposit>,
        @InjectRepository(Withdraw) private readonly withdrawRepository: Repository<Withdraw>,
        @InjectRepository(Transfer) private readonly transferRepository: Repository<Transfer>,
    ){}

    validNumber(amount: string | number, type: string){
        let conv;
        if (typeof(amount) ===  'number')
            conv = amount;
        else
            conv = parseInt(amount, 10);

        if (Number.isNaN(conv) || conv < 0 || !Number.isInteger(conv)){
            throw new HttpException(`${type} must be a valid Integer`, HttpStatus.FORBIDDEN);
        }
        return conv;
    }

    /*** BALANCE  ***/

    async createBalance(initialAmount: string | number = 0) {
        const conv = this.validNumber(initialAmount, 'amount');
        return this.balanceRepository.create({amount: conv}).save();
    }

    async getBalance(balanceId: string | number) {
        const conv = this.validNumber(balanceId, 'balanceId');
        const balance = await this.balanceRepository.findOne({id: conv});
        if (!balance){
            throw new HttpException('Balance does not exist', HttpStatus.NOT_FOUND);
        }
        else{
            return balance;
        }
    }

    async getBalances() {
        return this.balanceRepository.find({order: {id: 'ASC'}});
    }

    /*** DEPOSIT  ***/

    async createDeposit(balanceId: string | number = '', amount: string | number = ''){
        const balance = await this.getBalance(balanceId);
        const conv = this.validNumber(amount, 'amount');

        let deposit: unknown;
        await getManager().transaction(async manager => {
            await balance.increaseBalance(conv, manager);
            deposit = await this.depositRepository.create({balanceId: balance.id, amount: conv}).save();
        });
        return deposit as Deposit;
    }

    async getDeposits(){
        return this.depositRepository.find();
    }

    async getDeposit(depositId: string | number){
        const conv = this.validNumber(depositId, 'Id');
        const deposit = await this.depositRepository.findOne({id: conv});
        if (!deposit){
            throw new HttpException('Deposit does not exist', HttpStatus.NOT_FOUND);
        }
        else{
            return deposit;
        }
    }

    /*** WITHDRAWAL ***/

    async createWithdraw(balanceId: string | number = '', amount: string | number = ''){
        const balance = await this.getBalance(balanceId);
        const conv = this.validNumber(amount, 'amount');
        let withdraw: unknown;
        await getManager().transaction(async manager => {
            await balance.decreaseBalance(conv, manager);
            withdraw = await this.withdrawRepository.create({balanceId: balance.id, amount: conv}).save();
        });
        return withdraw as Withdraw;
    }

    async getWithdraws(){
        return this.withdrawRepository.find();
    }

    async getWithdraw(withdrawId: string | number){
        const conv = this.validNumber(withdrawId, 'Id');
        const withdraw = await this.withdrawRepository.findOne({id: conv});
        if (!withdraw){
            throw new HttpException('Withdrawal does not exist', HttpStatus.NOT_FOUND);
        }
        return withdraw;
    }
    /*** TRANSFERS ***/

    async createTransfer(senderBalanceId: string | number = '', receiverBalanceId: string | number = '', amount: string | number = ''){
        const sender = await this.getBalance(senderBalanceId);
        const receiver = await this.getBalance(receiverBalanceId);
        const conv = this.validNumber(amount, 'amount');
        let transfer: unknown;
        await getManager().transaction(async manager => {
            await sender.decreaseBalance(conv, manager);
            await receiver.increaseBalance(conv, manager);
            transfer = await this.transferRepository.create({senderBalanceId: sender.id, receiverBalanceId: receiver.id, amount: conv}).save();
        });
        return transfer as Transfer;
    }

    async getTransfer(transferId: string | number = ''){
        const conv = this.validNumber(transferId, 'transferId');
        const transfer = await this.transferRepository.findOne({id: conv});
        if (!transfer){
            throw new HttpException('Transfer does not exist', HttpStatus.NOT_FOUND);
        }
        return transfer;
    }

    async getTransfers(){
        return this.transferRepository.find();
    }
}