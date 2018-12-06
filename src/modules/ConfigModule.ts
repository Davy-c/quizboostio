import { Module, Global } from '@nestjs/common';
import { ConfigService } from '../services/ConfigService';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}