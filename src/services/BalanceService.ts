import { Injectable, Inject, Res, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BalanceServiceInterface } from '../interfaces/BalanceServiceInterface';
import { Balance } from 'src/entities/Balance.entity';

@Injectable()
export class BalanceService implements BalanceServiceInterface {
    constructor(
        @InjectRepository(Balance) private readonly balanceRepository: Repository<Balance>,
    ){}

    validAmount(amount: string | number){
        let conv;
        if (typeof(amount) ===  'number')
            conv = amount;
        else
            conv = parseInt(amount, 10);

        if (Number.isNaN(conv) || conv < 0 || !Number.isInteger(conv)){
            throw new HttpException('Amount must be valid Integer', HttpStatus.FORBIDDEN);
        }
        return conv;
    }
    async createBalance(initialAmount: string | number = 0) {
        const conv = this.validAmount(initialAmount);
        return this.balanceRepository.create({amount: conv}).save();
    }
    async getBalance(balanceId: string) {
        const balance = await this.balanceRepository.findOne({id: balanceId});
        if (!balance){
            throw new HttpException('Balance does not exist', HttpStatus.NOT_FOUND);
        }
        else{
            return balance;
        }
    }
    async getBalances() {
        return this.balanceRepository.find();
    }
}