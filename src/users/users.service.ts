import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(newUser);

      const { password: _, ...result } = savedUser;
      return result;

    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException(
          'Este número de teléfono ya está registrado',
        );
      }

      console.error('Error original:', error);
      throw new InternalServerErrorException(
        'Error inesperado al crear el usuario',
      );
    }
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map(({ password, ...user }) => user);
  }

  async findOneByPhone(phone: string) {
    
    return await this.usersRepository.findOne({
      where: { phone },
    });
  }

  
  async updateVerificationCode(userId: number, code: string) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    return await this.usersRepository.update(userId, {
      verificationCode: code,
      verificationCodeExpires: expiresAt, 
    });
  }

  
  async markAsVerified(userId: number) {
    return await this.usersRepository.update(userId, {
      isVerified: true,
      verificationCode: null, 
      verificationCodeExpires: null,
    });
  }

 
  async update(userId: number, updateData: Partial<User>) {
    return await this.usersRepository.update(userId, updateData);
  }
}