import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsOptional, IsString, Matches, MinLength} from "class-validator";
import {Transform} from "class-transformer";
import {RoleEntity} from "../../role/role.entity";

export class CreateUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com'
    })
    @IsEmail({}, {message: 'Please provide a valid email address'})
    @Transform(({value}) => value.toLowerCase())
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password123!',
        minLength: 8
    })
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'}
    )
    password: string;

    @ApiPropertyOptional({
        description: 'User first name',
        example: 'John'
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({
        description: 'User last name',
        example: 'Doe'
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({
        description: 'User phone number',
        example: '+901234567890'
    })
    @IsString()
    @IsOptional()
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: 'Please provide a valid phone number'
    })
    phoneNumber?: string;

    @ApiPropertyOptional({
        description: 'User role',
        example: 'user',
        default: 'user'
    })
    @IsString()
    @IsOptional()
    role?: string = 'user';

    @ApiPropertyOptional({
        description: 'User active status',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    roleEntity!: RoleEntity;
}