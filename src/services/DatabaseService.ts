import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
    constructor(@Inject('Connection') public connection: Connection) { }
}
