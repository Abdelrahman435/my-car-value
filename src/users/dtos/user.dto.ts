import { Expose, Exclude } from 'class-transformer';

// Exclude vs. Expose:   exclude means don't try to share and expose means you allow to share
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
