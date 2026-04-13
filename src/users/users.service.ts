import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { phone },
    });
  }

  async update(id: number, userData: Partial<User>): Promise<void> {
    await this.usersRepository.update(id, userData);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }
}