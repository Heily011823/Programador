import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TwilioService } from './twilio.service';
import { UserRole } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let twilioService: TwilioService;
  let jwtService: JwtService;

  const mockUsersService = {
    create: jest.fn(),
    findByPhone: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token_de_prueba'),
  };

  const mockTwilioService = {
    sendVerificationCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TwilioService,
          useValue: mockTwilioService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería registrar usuario y enviar código', async () => {
    mockUsersService.findByPhone.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 1,
      name: 'Heily',
      phone: '1234567890',
      isVerified: false,
      role: UserRole.CLIENT,
    });
    mockTwilioService.sendVerificationCode.mockResolvedValue({
      message: 'Código enviado por WhatsApp',
    });

    const result = await service.register({
      name: 'Heily',
      phone: '1234567890',
      password: '123456',
    });

    expect(usersService.findByPhone).toHaveBeenCalledWith('1234567890');
    expect(usersService.create).toHaveBeenCalled();
    expect(twilioService.sendVerificationCode).toHaveBeenCalled();
    expect(result).toEqual({
      message:
        'Usuario registrado. Se envió un código de verificación por WhatsApp.',
      phone: '1234567890',
    });
  });

  it('no debería registrar si el número ya existe', async () => {
    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      phone: '1234567890',
    });

    await expect(
      service.register({
        name: 'Heily',
        phone: '1234567890',
        password: '123456',
      }),
    ).rejects.toThrow(
      new BadRequestException('El número ya está registrado'),
    );
  });

  it('debería verificar número correctamente', async () => {
    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      phone: '1234567890',
      isVerified: false,
      verificationCode: '123456',
    });

    mockUsersService.update.mockResolvedValue({
      id: 1,
      isVerified: true,
      verificationCode: null,
    });

    const result = await service.verifyPhone({
      phone: '1234567890',
      code: '123456',
    });

    expect(usersService.findByPhone).toHaveBeenCalledWith('1234567890');
    expect(usersService.update).toHaveBeenCalledWith(1, {
      isVerified: true,
      verificationCode: null,
    });
    expect(result).toEqual({
      message: 'Número verificado correctamente',
    });
  });

  it('no debería verificar si el usuario no existe', async () => {
    mockUsersService.findByPhone.mockResolvedValue(null);

    await expect(
      service.verifyPhone({
        phone: '1234567890',
        code: '123456',
      }),
    ).rejects.toThrow(new UnauthorizedException('Usuario no existe'));
  });

  it('no debería verificar si el código es inválido', async () => {
    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      phone: '1234567890',
      isVerified: false,
      verificationCode: '654321',
    });

    await expect(
      service.verifyPhone({
        phone: '1234567890',
        code: '123456',
      }),
    ).rejects.toThrow(new BadRequestException('Código inválido'));
  });

  it('debería hacer login si el usuario está verificado', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      name: 'Heily',
      phone: '1234567890',
      password: hashedPassword,
      isVerified: true,
      role: UserRole.ADMIN,
    });

    const result = await service.login({
      phone: '1234567890',
      password: '123456',
    });

    expect(usersService.findByPhone).toHaveBeenCalledWith('1234567890');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      phone: '1234567890',
      role: UserRole.ADMIN,
    });
    expect(result).toEqual({
      access_token: 'token_de_prueba',
      user: {
        id: 1,
        name: 'Heily',
        phone: '1234567890',
        role: UserRole.ADMIN,
      },
    });
  });

  it('no debería permitir login si el usuario no existe', async () => {
    mockUsersService.findByPhone.mockResolvedValue(null);

    await expect(
      service.login({
        phone: '1234567890',
        password: '123456',
      }),
    ).rejects.toThrow(new UnauthorizedException('Usuario no existe'));
  });

  it('no debería permitir login si la contraseña es incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('otra-clave', 10);

    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      name: 'Heily',
      phone: '1234567890',
      password: hashedPassword,
      isVerified: true,
      role: UserRole.CLIENT,
    });

    await expect(
      service.login({
        phone: '1234567890',
        password: '123456',
      }),
    ).rejects.toThrow(new UnauthorizedException('Contraseña incorrecta'));
  });

  it('no debería permitir login si el usuario no está verificado', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    mockUsersService.findByPhone.mockResolvedValue({
      id: 1,
      name: 'Heily',
      phone: '1234567890',
      password: hashedPassword,
      isVerified: false,
      role: UserRole.CLIENT,
    });

    await expect(
      service.login({
        phone: '1234567890',
        password: '123456',
      }),
    ).rejects.toThrow(
      new UnauthorizedException(
        'Debes verificar tu número antes de iniciar sesión',
      ),
    );
  });
});