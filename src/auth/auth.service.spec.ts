import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TwoFaService } from '../twofa/twofa.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let twoFaService: TwoFaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token_de_prueba'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneByPhone: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: TwoFaService,
          useValue: {
            generateCode: jest.fn(),
            sendCode: jest.fn(),
            validateCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    twoFaService = module.get<TwoFaService>(TwoFaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  
  it('debería registrar usuario y enviar código', async () => {
    (usersService.create as jest.Mock).mockResolvedValue({
      id: 1,
      phone: '123',
      isVerified: false,
    });

    (twoFaService.generateCode as jest.Mock).mockReturnValue('123456');
    (twoFaService.sendCode as jest.Mock).mockResolvedValue(true);

    const result = await service.register('123', 'pass', 'Heily');

    expect(usersService.create).toHaveBeenCalled();
    expect(twoFaService.generateCode).toHaveBeenCalled();
    expect(twoFaService.sendCode).toHaveBeenCalledWith('123', '123456');
  });

  
  it('debería verificar usuario correctamente', async () => {
    (twoFaService.validateCode as jest.Mock).mockResolvedValue(true);
    (usersService.update as jest.Mock).mockResolvedValue(true);

    const result = await service.verifyPhoneNumber('123', '123456');

    expect(twoFaService.validateCode).toHaveBeenCalledWith('123', '123456');
    expect(usersService.update).toHaveBeenCalledWith('123', {
      isVerified: true,
    });
  });

 
  it('debería hacer login si está verificado', async () => {
    (usersService.findOneByPhone as jest.Mock).mockResolvedValue({
      id: 1,
      phone: '123',
      password: 'pass',
      isVerified: true,
    });

    const result = await service.login('123', 'pass');

    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'token_de_prueba' });
  });

  
  it('NO debería permitir login si no está verificado', async () => {
    (usersService.findOneByPhone as jest.Mock).mockResolvedValue({
      id: 1,
      phone: '123',
      password: 'pass',
      isVerified: false,
    });

    await expect(service.login('123', 'pass')).rejects.toThrow(
      new UnauthorizedException('Usuario no verificado'),
    );
  });
});