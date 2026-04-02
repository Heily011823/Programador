import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { User } from './user.entity'; 
import { CreateUserDto } from './dto/create-user.dto'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.usersRepository.create(createUserDto);
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