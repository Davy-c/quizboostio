import { EntityRepository, Repository} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Balance } from '../../entities/Balance.entity';
import { Deposit } from '../../entities/Deposit.entity';
import { Withdraw } from '../../entities/Withdraw.entity';
import { Transfer } from '../../entities/Transfer.entity';

@EntityRepository(Balance)
@Injectable()
export class BalanceRepository extends Repository<Balance> {
    test() {
        console.log('it works');
    }
}
@EntityRepository(Deposit)
@Injectable()
export class DepositRepository extends Repository<Deposit> {}

@EntityRepository(Withdraw)
@Injectable()
export class WithdrawRepository extends Repository<Withdraw> {}

@EntityRepository(Transfer)
@Injectable()
export class TransferRepository extends Repository<Transfer> {}