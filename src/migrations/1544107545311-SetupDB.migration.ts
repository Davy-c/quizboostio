import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class SetupDB1544107545311 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'balances',
            columns: [
              {
                name: 'id',
                type: 'bigint',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'amount',
                type: 'bigint',
                default: 0,
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'now()',
              },
            ],
            checks: [
              {
                columnNames: ['amount'],
                expression: `"amount" >= 0`,
              },
            ],
          }), true);
        await queryRunner.createTable(new Table({
        name: 'deposits',
        columns: [
            {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            },
            {
            name: 'balanceId',
            type: 'bigint',
            },
            {
            name: 'amount',
            type: 'bigint',
            },
            {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            },
        ],
        }), true);
        await queryRunner.createTable(new Table({
            name: 'withdraws',
            columns: [
              {
                name: 'id',
                type: 'bigint',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'balanceId',
                type: 'bigint',
              },
              {
                name: 'amount',
                type: 'bigint',
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'now()',
              },
            ],
          }), true);
        await queryRunner.createTable(new Table({
          name: 'transfers',
          columns: [
            {
              name: 'id',
              type: 'bigint',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'senderBalanceId',
              type: 'bigint',
            },
            {
              name: 'receiverBalanceId',
              type: 'bigint',
            },
            {
              name: 'amount',
              type: 'bigint',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }), true);
        await queryRunner.createForeignKeys('transfers', [
          new TableForeignKey({
            columnNames: ['senderBalanceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'balances',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['receiverBalanceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'balances',
            onDelete: 'CASCADE',
          }),
        ]);
        await queryRunner.createForeignKey('deposits', new TableForeignKey({
          columnNames: ['balanceId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'balances',
          onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('withdraws', new TableForeignKey({
          columnNames: ['balanceId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'balances',
          onDelete: 'CASCADE',
        }));
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('transfers');
        await queryRunner.dropTable('deposits');
        await queryRunner.dropTable('withdraws');
        await queryRunner.dropTable('balances');
    }
}