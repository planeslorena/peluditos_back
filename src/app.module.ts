import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { TurnosModule } from './turnos/turnos.module';
import { AdminModule } from './admin/admin.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ClientService } from './client/client.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      logging: 'all',
    }),
    ScheduleModule.forRoot(),
    ClientModule,
    TurnosModule,
    AdminModule,
    WhatsappModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }