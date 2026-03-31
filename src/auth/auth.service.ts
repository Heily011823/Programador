import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = {
      email: data.email,
      password: hashedPassword,
      twoFactorCode: Math.floor(100000 + Math.random() * 900000), // 👈 2FA simple
    };

    return this.usersService.create(user);
  }

  async login(data: any) {
    const user = this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}