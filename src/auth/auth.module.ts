import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../users/user.entity';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RolesService} from "../role/roles.service";
import {RolesModule} from "../role/roles.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
      RolesModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})

export class AuthModule {
  constructor() {
    console.log('JWT_SECRET_KEY in AuthModule:', process.env.JWT_SECRET);
  }
}
