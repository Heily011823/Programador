import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            verifyPhoneNumber: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debería registrar un usuario correctamente', async () => {
      const body = {
        phone: '3001234567',
        password: '123456',
        name: 'Heily',
      };

      (authService.register as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(
        body.phone,
        body.password,
        body.name,
      );

      expect(result).toEqual({
        message: 'Usuario registrado. Código de verificación enviado',
      });
    });

    it('debería lanzar error si faltan campos', async () => {
      const body = {
        phone: '3001234567',
        password: '123456',
      };

      await expect(controller.register(body as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  describe('verify', () => {
    it('debería verificar un usuario correctamente', async () => {
      const body = {
        phone: '3001234567',
        code: '123456',
      };

      (authService.verifyPhoneNumber as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.verify(body);

      expect(authService.verifyPhoneNumber).toHaveBeenCalledWith(
        body.phone,
        body.code,
      );

      expect(result).toEqual({
        message: 'Usuario verificado correctamente',
      });
    });

    it('debería lanzar error si faltan phone o code', async () => {
      const body = {
        phone: '3001234567',
      };

      await expect(controller.verify(body as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(authService.verifyPhoneNumber).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería hacer login correctamente', async () => {
      const body = {
        phone: '3001234567',
        password: '123456',
      };

      const mockLoginResponse = {
        access_token: 'jwt-token',
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

      const result = await controller.login(body);

      expect(authService.login).toHaveBeenCalledWith(
        body.phone,
        body.password,
      );

      expect(result).toEqual(mockLoginResponse);
    });

    it('debería lanzar error si faltan phone o password', async () => {
      const body = {
        phone: '3001234567',
      };

      await expect(controller.login(body as any)).rejects.toThrow(
        BadRequestException,
      );

      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});