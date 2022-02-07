import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';



@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ id });
  }

  find(email: string) {
    console.log(email)
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    Object.assign(user, attrs);
    return this.repo.save(user);

  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("user not found");
    }

    return this.repo.remove(user);
  }

  async setAdminFlag(body: any) {
    const { id, admin } = body;

    // @ts-ignore
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    Object.assign(user, { admin: body.admin })
    return user;
  }

}
