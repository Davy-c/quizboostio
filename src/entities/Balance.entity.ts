import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, Check, EntityManager, getManager} from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BalanceError extends Error {
  name = 'BalanceError';
}

function getPositiveValue(amount: string | number): number{
  let conv;
  if (typeof(amount) ===  'number')
      conv = amount;
  else
      conv = parseInt(amount, 10);
  if (Number.isNaN(conv) || conv < 0 || !Number.isInteger(conv)){
      throw new HttpException('The given value must be a valid Integer', HttpStatus.FORBIDDEN);
  }
  return conv;
}

@Entity('balances')
@Check(`"amount" >= 0`)
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('bigint')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  async increaseBalance(amount: number | string, emanager?: EntityManager){
    if (!emanager) emanager = getManager();
    const conv = getPositiveValue(amount);
    const newAmount = parseInt(conv.toString(), 10) + parseInt(this.amount.toString(), 10);
    try{
      await emanager.createQueryBuilder(Balance, 'entity').update(Balance)
      .set({amount: newAmount}).where({id: this.id}).execute();
    } catch (error){
      throw new HttpException('Problem with the database', 500);
    }
  }

  async decreaseBalance(amount: number | string, emanager?: EntityManager){
    if (!emanager) emanager = getManager();
    const conv = getPositiveValue(amount);
    const endTransaction = parseInt(this.amount.toString(), 10) - parseInt(conv.toString(), 10);
    if ( endTransaction > 0){
      try{
        await emanager.createQueryBuilder(Balance, 'Entity').update(Balance)
        .set({amount: endTransaction}).where({id: this.id}).execute();
      } catch (error){
        throw new HttpException('Problem with the database', 500);
      }
    }
    else{
      throw new HttpException('The current fund is insufficient for this withdrawal', HttpStatus.FORBIDDEN);
    }
  }
}
