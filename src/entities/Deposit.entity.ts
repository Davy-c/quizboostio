import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('deposits')
export class Deposit extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('bigint')
  balanceId: string;

  @Column('bigint')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
