import { IsEmail, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsString()
  password!: string;
}
export class LoginResponseDto {
  @ApiProperty({ description: 'JWT Access Token for authentication', example: 'ey123...' })
  access_token!: string;
}