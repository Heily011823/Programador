import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  //  Crear usuario
  it('debería crear un usuario', async () => {
    const dto = {
      name: 'Juan',
      phone: '123',
      password: '123456',
    };

    const user = { id: 1, ...dto };

    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    const result = await service.create(dto);

    expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
    expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  //  Obtener todos los usuarios
  it('debería retornar todos los usuarios', async () => {
    const users = [
      { id: 1, name: 'Juan', phone: '123' },
      { id: 2, name: 'Ana', phone: '456' },
    ];

    mockUserRepository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  //  Buscar por teléfono
  it('debería retornar un usuario por teléfono', async () => {
    const user = { id: 1, name: 'Juan', phone: '123' };

    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await service.findOneByPhone('123');

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { phone: '123' },
    });

    expect(result).toEqual(user);
  });

  //  Usuario no encontrado
  it('debería retornar null si no encuentra el usuario', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const result = await service.findOneByPhone('000');

    expect(result).toBeNull();
  });
});