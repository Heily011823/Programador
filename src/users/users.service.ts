import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Heily Rios', phone: '+573244634115' },
  ];

  async create(user: { name: string; phone: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }

  async findAll() {
    return this.users;
  }

  async findOneByPhone(phone: string) {
    return this.users.find(u => u.phone === phone);
  }
}