import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as Path from 'path';
import { DatabaseService } from '../services/DatabaseService';
import { BalanceService } from '../services/BalanceService';

@Injectable()
export class TestUtils {
    databaseService: DatabaseService;
    balanceService: BalanceService;

    constructor(databaseService: DatabaseService, balanceService: BalanceService) {
        if (process.env.NODE_ENV !== 'test') {
          throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
        }
        this.databaseService = databaseService;
        this.balanceService = balanceService;
    }

    async shutdownServer(server) {
        await server.httpServer.close();
        await this.closeConnection();
    }

    getOrder(entityName) {
        const order: string[] = JSON.parse(fs.readFileSync(Path.join(__dirname, '../tests/fixtures/_order.json'), 'utf8'));
        return order.indexOf(entityName);
    }

    async getEntities() {
        const entities = [];
        (await (await this.databaseService.connection).entityMetadatas).forEach(
        x => entities.push({ name: x.name, tableName: x.tableName, order: this.getOrder(x.name)}),
        );
        return entities;
    }

    async cleanAll(entities) {
        try {
            for (const entity of entities.sort((a, b) => b.order - a.order)) {
                const repository = await this.balanceService.getRepository(entity.name);
                await repository.query(`DELETE FROM ${entity.tableName};`);
                await repository.query(`ALTER SEQUENCE ${entity.tableName}_id_seq RESTART WITH 1`);
            }
        } catch (error) {
            throw new Error(`ERROR: Cleaning test db: ${error}`);
        }
    }

    async cleanDB(){
        const entities = await this.getEntities();
        await this.cleanAll(entities);
    }

    async closeConnection() {
        const connection = (await this.databaseService.connection);
        if (connection.isConnected) {
            await (await this.databaseService.connection).close();
        }
    }

    async countEntity(entity: string){
        return this.databaseService.connection.getRepository(entity).count();
    }

    async getFirstEntity(entity: string): Promise< any >{
        return this.databaseService.connection.getRepository(entity).findOne();
    }

    async generateDummyBalance(val?: string | number){
        return this.balanceService.createBalance(val);
    }

}

export default TestUtils;