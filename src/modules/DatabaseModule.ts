import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseService } from '../services/DatabaseService';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class DatabaseModule {
  constructor() {}
}
