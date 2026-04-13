import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('AUTH HEADER EN GUARD:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('ERROR EN JWT GUARD:', err);
    console.log('USER EN JWT GUARD:', user);
    console.log('INFO EN JWT GUARD:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o no autorizado');
    }

    return user;
  }
}