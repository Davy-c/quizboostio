import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transfers')
export class Transfer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('bigint')
  senderBalanceId: string;

  @Column('bigint')
  receiverBalanceId: string;

  @Column('bigint')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
