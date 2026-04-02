import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; 

@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService, 
  ) {}

 
  async login(user: any) {
    const payload = { 
      phone: user.phone, 
      sub: user.id, 
      name: user.name 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  
  async validateUser(phone: string): Promise<any> {
    const user = await this.usersService.findOneByPhone(phone); 
    
    if (!user) {
      
      throw new UnauthorizedException('El número de teléfono no está registrado.');
    }
    
    return user;
  }
}