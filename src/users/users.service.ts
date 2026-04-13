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

  private sanitizeUser(user: User | null) {
    if (!user) return null;

    const { password, verificationCode, ...safeUser } = user;
    return safeUser;
  }

  async create(userData: Partial<User>): Promise<Partial<User>> {
    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async findByPhone(phone: string): Promise<Partial<User> | null> {
    const user = await this.usersRepository.findOne({
      where: { phone },
    });

    return this.sanitizeUser(user);
  }

  async findByPhoneWithPassword(phone: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { phone },
    });
  }

  async update(id: number, userData: Partial<User>): Promise<Partial<User> | null> {
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });

    return this.sanitizeUser(updatedUser);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find({
      order: { id: 'ASC' },
    });

    return users.map((user) => this.sanitizeUser(user));
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findSafeById(id: number): Promise<Partial<User> | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    return this.sanitizeUser(user);
  }
}