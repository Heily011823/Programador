import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
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

      
      return await this.usersRepository.save(newUser);

    } catch (error: any) { 
      
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Este número de teléfono ya está registrado');
      }
      
      console.error('Error original:', error); 
      throw new InternalServerErrorException('Error inesperado al crear el usuario');
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }
  
  async findOneByPhone(phone: string) {
    return await this.usersRepository.findOne({ where: { phone } });
  }
}