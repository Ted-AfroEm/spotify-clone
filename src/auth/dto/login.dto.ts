import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString() @IsNotEmpty() password: string;
}
