import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: { sub: number; phone: string; role: string }) {
    const user = await this.usersService.findById(payload.sub);

    console.log('PAYLOAD JWT:', payload);

    console.log('USER ENCONTRADO:', user);

    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    };
  }
}