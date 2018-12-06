import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('withdraws')
export class Withdraw extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('bigint')
  balanceId!: string;

  @Column('bigint')
  amount: string;

  @CreateDateColumn()
  createdDate: Date;
}
