import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HireModule } from './hire/hire.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [HireModule, SharedModule, TypeOrmModule.forRoot({ entities: ['**/*.entity.ts'] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
