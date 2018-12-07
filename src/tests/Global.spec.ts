import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository, getConnection, getConnectionOptions, createConnection, Connection } from 'typeorm';

import { Balance } from '../entities/Balance.entity';
import { Deposit } from '../entities/Deposit.entity';
import { Withdraw } from '../entities/Withdraw.entity';
import { Transfer } from '../entities/Transfer.entity';

import { ConfigModule } from '../modules/ConfigModule';
import { BalanceModule } from '../modules/BalanceModule';
import { DatabaseModule } from '../modules/DatabaseModule';

import { TestUtils } from '../utils/TestUtils';
import * as request from 'supertest';
import { BalanceController } from '../controllers/BalanceController';
import { BalanceService } from '../services/BalanceService';
import { DatabaseService } from '../services/databaseservice';

import { BalanceInterface } from '../interfaces/BalanceInterface';

import { HttpException } from '@nestjs/common';

describe('BANKING service', () => {
    let utils: TestUtils;
    let bs, ds;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule,
                BalanceModule,
                DatabaseModule,
            ],
            controllers: [BalanceController],
            providers: [
                BalanceService,
                DatabaseService,
                TestUtils,
            ],
        }).compile();
        bs = module.get<BalanceService>(BalanceService);
        ds = module.get<DatabaseService>(DatabaseService);
        utils =  new TestUtils(ds, bs);

        await utils.cleanDB();
    });

    describe('/balances', () => {
        it('Get all : should display 0 balance', async () => {
            expect(await utils.countEntity('Balance')).toBe(0);
        });
        it('Add a balance : should return a balance', async () => {
            expect(await utils.generateDummyBalance()).toBeDefined();
        });
        it('Add a negative balance : should return an exception', async () => {
            let caught = 0;
            try{ const res = await utils.generateDummyBalance('-500'); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Add a non valid balance : should return an exception', async () => {
            let caught = 0;
            try{ const res = await utils.generateDummyBalance('X'); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Get the balance : should return one balance', async () => {
            expect(await utils.getFirstEntity('Balance')).toBeDefined();
        });
        it('Get a non-existent balance : should return a 404', async () => {
            let caught = 0;
            try{ await utils.balanceService.getBalance(58); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Get all : should display 1 balance', async () => {
            expect(await utils.countEntity('Balance')).toBe(1);
        });
        it('Get one : should display 1 balance', async () => {
            expect(await utils.getFirstEntity('Balance')).toBeDefined();
        });
    });

    describe('/deposits', () => {
        it('Get all : should display 0 deposit', async () => {
            expect(await utils.countEntity('Deposit')).toBe(0);
        });
        it('Get a non-existent deposit : should return a 404', async () => {
            let caught = 0;
            try{ await utils.balanceService.getDeposit(58); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Add deposit of 500 : should return deposit & update balance with 500 more', async () => {
            let full = 0;
            let b: Balance = await utils.getFirstEntity('Balance');
            const dep = await utils.balanceService.createDeposit(b.id, 500);
            b = await utils.getFirstEntity('Balance');
            if (dep && b.amount.toString() === '500')
                full = 1;
            expect(full.toString()).toMatch('1');
        });
        it('Add a deposit without a balance : should return an exception', async () => {
            let caught = 0;
            try{ await utils.balanceService.createDeposit('', 587); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Add a negative deposit : should return an exception', async () => {
            let caught = 0;
            try{ await utils.balanceService.createDeposit(1, -58); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Add a non valid deposit : should return an exception', async () => {
            let caught = 0;
            try{ await utils.balanceService.createDeposit(1, 'X'); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        });
        it('Get all : should return one deposit', async () => {
            expect(await utils.countEntity('Deposit')).toBe(1);
        });
        it('Get one : should return one deposit', async () => {
            expect(await utils.getFirstEntity('Deposit')).toBeDefined();
        });
    });

    describe('/withdraws', () => {
        it('Get all: should display 0 withdraw', async() => {
            expect(await utils.countEntity('Withdraw')).toBe(0);
        })

        it('Get non-existent withdraw: should display Exception', async() => {
            let caught = 0;
            try{ await utils.balanceService.getWithdraw(1); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Add withdraw of 100 to previous balance: should be at 400', async () => {
            let full = 0;
            let b: Balance = await utils.getFirstEntity('Balance');
            const wit = await utils.balanceService.createWithdraw(b.id, 100);
            b = await utils.getFirstEntity('Balance');
            if (wit && b.amount.toString() === '400')
                full = 1;
            expect(full.toString()).toMatch('1');
        })

        it('Add withdraw of 600: not enough fund so exception', async() => {
            let caught = 0;
            const b: Balance = await utils.getFirstEntity('Balance');
            try{ await utils.balanceService.createWithdraw(b.id, 600); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Add withdraw without balance: Exception', async() =>  {
            let caught = 0;
            try{ await utils.balanceService.createWithdraw('', 600); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })
        it('Add non valid withdraw: Exception', async() => {
            let caught = 0;
            const b: Balance = await utils.getFirstEntity('Balance');
            try{ await utils.balanceService.createWithdraw(b.id, 'L'); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })
        it('Add negative withdraw: Exception', async() => {
            let caught = 0;
            const b: Balance = await utils.getFirstEntity('Balance');
            try{ await utils.balanceService.createWithdraw(b.id, -200); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Get all withdraw : should return one withdraw', async() => {
            expect(await utils.countEntity('Withdraw')).toBe(1);
        })

        it('Get one withdraw : should return one withdraw', async() => {
            expect(await utils.getFirstEntity('Withdraw')).toBeDefined();
        })
    });
    
    describe('/transfers', () => {
        it('Get all transfers : Should display 0 transfer', async() => {
            expect(await utils.countEntity('Transfer')).toBe(0);
        })
        
        it('Get one non-existent transfer: Should return exception', async() => {
            let caught = 0;
            try{ await utils.balanceService.getTransfer(1); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })
        it('Transfer does not have valid balance sender : Exception', async() => {
            let caught = 0;
            try{ await utils.balanceService.createTransfer(123, 1, 200); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Transfer does not have valid balance receiver: Exception', async() => {
            let caught = 0;
            try{ await utils.balanceService.createTransfer(1, 123, 200); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Add a balance : should return a balance', async () => {
            expect(await utils.generateDummyBalance(8000)).toBeDefined();
        });
        
        it('Get all : should display 2 balances', async () => {
            expect(await utils.countEntity('Balance')).toBe(2);
        });

        it('Transfer has negative amount: Exception', async () => {
            let caught = 0;
            try{ await utils.balanceService.createTransfer(1, 2, -200); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Sender balance can not afford to send this much : Exception', async () => {
            let caught = 0;
            try{ await utils.balanceService.createTransfer(1, 2, 20000); }
            catch (HttpException){
                caught = 1;
            }
            expect(caught.toString()).toMatch('1');
        })

        it('Add Transfer : one transfer & Receiver gaining 200 while Sender loosing 200', async() => {
            let full = 0;
            const sender: Balance = await utils.balanceService.getBalance(1);
            const receiver: Balance = await utils.balanceService.getBalance(2);
            const tra = await utils.balanceService.createTransfer(sender.id, receiver.id, 200);
            const sender2: Balance = await utils.balanceService.getBalance(1);
            const receiver2: Balance = await utils.balanceService.getBalance(2);
            if (
                    tra &&
                    (parseInt(sender.amount.toString(), 10) - parseInt('200', 10) === parseInt(sender2.amount.toString(), 10)) &&
                    (parseInt(receiver.amount.toString(), 10) + parseInt('200', 10) === parseInt(receiver2.amount.toString(), 10))
                )
            {
                full = 1;
            }
            expect(full.toString()).toMatch('1');
        })

        it('Get all : Should return one transfer', async () => {
            expect(await utils.countEntity('Transfer')).toBe(1);
        });
        it('Get one : should return one transfer', async () => {
            expect(await utils.getFirstEntity('Transfer')).toBeDefined();
        })
    })

    afterAll(() => {
       utils.closeConnection();
    });

});