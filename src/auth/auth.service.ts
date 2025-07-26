import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UsersService} from '../users/users.service';
import {LoginDto, LoginResponseDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";
import {RegisterResponseDto} from "./dto/registerResponseDto";
import {RolesService} from "../role/roles.service";
import {BaseApiResponse} from "../common/dto/api-response-dto";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
                private jwtService: JwtService,
                private rolesService: RolesService
    ) {
    }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findOneDynamic(
            {email: email, isActive: true},
            ['role', 'role.permissions'],
        );
        if (user) {
            let isHashMatched = await bcrypt.compare(pass, user.password)
            if (isHashMatched) {
                return user;
            }
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(dto: LoginDto): Promise<BaseApiResponse<LoginResponseDto>> {
        const user = await this.validateUser(dto.email, dto.password);
        // console.log('JWT Secret:', process.env.JWT_SECRET);
        const payload = {email: user.email, sub: user.id};
        return {
            message: "Login Success",
            success: true,
            data: {
                access_token: this.jwtService.sign(payload)
            }
        };
    }

    async register(createUserDto: RegisterDto): Promise<BaseApiResponse<RegisterResponseDto>> {
        const role = await this.rolesService.findOne(createUserDto.roleId);

        if (!role) {
            throw new Error('Role not found');
        }
        let createRes = await this.usersService.createUser({
            ...createUserDto,
            roleEntity: role,
        });

        return {
            message: "Register Success",
            success: true,
            data: {
                email: createRes.email,
                roleName: role.name
            }
        };
    }
}