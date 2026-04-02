import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { User } from './user.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}


  async create(userData: { name: string; phone: string }) {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }


  async findAll() {
    return await this.usersRepository.find();
  }

  
  async findOneByPhone(phone: string) {
    return await this.usersRepository.findOne({ where: { phone } });
  }
}