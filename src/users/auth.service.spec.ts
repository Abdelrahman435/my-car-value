import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  // describe add further description
  let service: AuthService;
  let fackUsersService: Partial<UsersService>;
  beforeEach(async () => {
    //Create a fake copy of the users service
    const users: User[] = [];
    fackUsersService = {
      // here we write Partial because we want to methods only to check the logical are the same in usersService we arenot uesd all functions in usersService
      find: (email: string) => {
        const filterUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filterUsers); // promise.resolve is creat a promise and asign it to the value in () (here array is the value)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user); // here to tell typeScript just create it as user entity
      },
    }; //find and create are async functions taking some time to read or write data then we have to return a promise

    const module = await Test.createTestingModule({
      providers: [
        AuthService, // First line is tell the di container that the some point time want to create an instance of the auth service
        { provide: UsersService, useValue: fackUsersService }, // second line is the object that reroutes the di system that can change how different classes or different things can resolve it tell if anyone asks for UserService , give them the value in useValue (fakeUsersService)
      ], // Providers array is a list of different classes that we want to register in our testing Di container
    }).compile();

    // Then i will get a copy of the AuthService
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a saltd and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test0000');
    expect(user.password).not.toEqual('test0000'); // we want to know the password is stored is not equal to one we sent that means the password are hashed and salted
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    // then check that the password are contained salt and hash
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'sfdfsgxbfx');
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'test0000');

    expect(await service.signin('test@test.com', 'test0000')).toBeDefined;
  });
});
