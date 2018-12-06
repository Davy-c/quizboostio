import { Controller, Get, Post, Request, Param, Res, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { BalanceService } from 'src/services/BalanceService';

@Controller()
export class BalanceController{
  constructor(
    @Inject('BalanceService') private bs: BalanceService,
  ){}

  /**** BALANCES ****/

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

  /***** DEPOSITS  *****/

  @Get('/deposits')
  async getDeposits(){
      return this.bs.getDeposits();
  }

  @Get('/deposits/:id')
  async getDeposit(@Param() pr){
      return this.bs.getDeposit(pr.id);
  }

  @Post('/deposits')
  async createDeposit(@Body() body){
      return this.bs.createDeposit(body.balanceId, body.amount);
  }

  /**** WITHDRAWALS ****/

  /**** TRANSFERS  *****/

}