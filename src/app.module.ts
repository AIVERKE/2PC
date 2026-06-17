import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionLog } from './log/transaction-log.entity';
import { TransactionModule } from './transaction/transaction.module';
import { CoordinatorModule } from './coordinator/coordinator.module'; // <-- Importamos el Coordinador

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [TransactionLog],
        synchronize: true,
      }),
    }),
    TransactionModule,
    CoordinatorModule, // <-- Lo registramos aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
