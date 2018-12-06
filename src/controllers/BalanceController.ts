import { Controller, Get, Post, Request, Param, Res, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { BalanceService } from 'src/services/BalanceService';

@Controller()
export class BalanceController{
  constructor(
    @Inject('BalanceService') private bs: BalanceService,
  ){}

  @Get('/balances')
  async getBalances(){
      return this.bs.getBalances();
  }

  @Get('/balances/:id')
  async getBalance(@Param() pr){
    return this.bs.getBalance(pr.id);
  }

  @Post('/balances')
  async createBalance(@Body() body){
    return this.bs.createBalance(body.amount);
  }
}