import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFaService } from '../twofa/twofa.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let twoFaService: TwoFaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
            verifyUser: jest.fn(),
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    twoFaService = module.get<TwoFaService>(TwoFaService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería registrar un usuario y enviar código de verificación', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    (authService.register as jest.Mock).mockResolvedValue({ id: 1, ...dto });
    (twoFaService.generateCode as jest.Mock).mockReturnValue('123456');
    (twoFaService.sendCode as jest.Mock).mockResolvedValue(true);

    const result = await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(twoFaService.generateCode).toHaveBeenCalled();
    expect(twoFaService.sendCode).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Usuario registrado. Código de verificación enviado',
    });
  });

  it('debería verificar el usuario con código correcto', async () => {
    const dto = { email: 'test@test.com', code: '123456' };
    (twoFaService.validateCode as jest.Mock).mockResolvedValue(true);
    (authService.verifyUser as jest.Mock).mockResolvedValue(true);

    const result = await controller.verify(dto);

    expect(twoFaService.validateCode).toHaveBeenCalledWith(dto.email, dto.code);
    expect(authService.verifyUser).toHaveBeenCalledWith(dto.email);
    expect(result).toEqual({
      message: 'Usuario verificado correctamente',
    });
  });

  it('debería permitir login a usuario verificado', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    (authService.validateUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: dto.email,
      isVerified: true,
    });
    (authService.login as jest.Mock).mockResolvedValue({
      access_token: 'jwt-token',
    });

    const result = await controller.login(dto);

    expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
    expect(authService.login).toHaveBeenCalled();
    expect(result).toHaveProperty('access_token');
  });

  it('NO debería permitir login a usuario no verificado', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    (authService.validateUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: dto.email,
      isVerified: false,
    });

    await expect(controller.login(dto)).rejects.toThrow('Usuario no verificado');
  });
});