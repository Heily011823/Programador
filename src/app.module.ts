import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { TwoFaModule } from './twofa/twofa.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '#Septiembre18.', 
      database: 'programador', 
      autoLoadEntities: true, 
      synchronize: true, 
    }),

    AuthModule, 
    UsersModule, 
    PaymentsModule, 
    TwoFaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}