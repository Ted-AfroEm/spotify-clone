import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) { }
  @Post("signup")
  signup(@Body() userDTO: CreateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.create(userDTO);
  }
}
