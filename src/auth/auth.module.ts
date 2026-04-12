import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
<<<<<<< HEAD
import { JwtModule } from '@nestjs/jwt';
import { TwoFaModule } from '../twofa/twofa.module';

@Module({
  imports: [
    UsersModule,
    TwoFaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule], 
=======

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secreto_super_seguro',
      signOptions: { expiresIn: '5m' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
>>>>>>> feature/auth
})
export class AuthModule {}