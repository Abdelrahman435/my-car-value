import { Injectable, NotFoundException } from '@nestjs/common'; // Marks this class as a service that can be injected
import { Repository } from 'typeorm'; // Used for database operations
import { InjectRepository } from '@nestjs/typeorm'; // Allows injecting a TypeORM repository
import { User } from './user.entity'; // Import the User entity (maps to the users table in the database)

@Injectable() // Marks this class as a NestJS provider
export class UsersService {
  // Property to hold the User repository (optional; constructor handles it automatically)
  // repo: Repository<User>;

  // Constructor to inject the User repository
  constructor(@InjectRepository(User) private repo: Repository<User>) {
    // Explicit assignment of repo is unnecessary because of the 'private' modifier
    // this.repo = repo;
  }
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    // if i run save without runs create hooks(AfterInsert, AfterRemove, AfterUpdate) will not executed
    return this.repo.save(user);
  }

  // You can add service methods here to interact with the User repository
  // Example: Create, find, update, delete users

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrbutes: Partial<User>) {
    // Partial this is a type helper defined in typeScript itself this type helper tells this attributes can be any object that has at least one or more properties of user class or empty object
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, attrbutes); // Object.assign here will take attributes and user that returns from findOne and update user by a new values(attributes)
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  } // we use remove instead of delete because remove it takes entity and run get user first and then remove it then hooks will run but delete takes id and delete the user with this id and not run hooks
}
