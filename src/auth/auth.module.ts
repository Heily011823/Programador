import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TwoFaModule } from '../twofa/twofa.module'; 

@Module({
  imports: [
    UsersModule,
    TwoFaModule, 
    JwtModule.register({
<<<<<<< HEAD
      
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '5m' }, 
=======
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
>>>>>>> feature/auth-users
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}