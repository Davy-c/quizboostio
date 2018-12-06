import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, Check } from 'typeorm';

export class BalanceError extends Error {
  name = 'BalanceError';
}

@Entity('balances')
@Check(`"amount" >= 0`)
export default class Balance extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('bigint')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
