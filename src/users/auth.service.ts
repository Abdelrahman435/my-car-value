import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); //Converts scrypt into a Promise-based function for asynchronous usage. Promisifies the scrypt function, enabling it to use async/await.

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 1) See if email already exists
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email already exists');

    // 2) Hash the users password
    // 2-1) Generate a salt
    const salt = randomBytes(8).toString('hex'); // hex string means make the random bytes to value of numbers and letters and number 8 here will be after toString('hex') to 16 characters long
    //2-2) Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; //The output of scrypt is a 32-byte binary value, and it's returned as a Buffer object.

    //2-3) Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // 3) Create a new user and save it
    const user = await this.usersService.create(email, result);
    // 4) return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Invalid Email or Password');

    return user;
  }
}
