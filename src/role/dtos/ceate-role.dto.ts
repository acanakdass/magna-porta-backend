import {IsOptional, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @IsString()
    @ApiProperty({ description: 'Name of the role', example: 'administrator' })
    name: string;

    @ApiProperty({ description: 'Desc of the role', example: 'Admin Rolü' })
    @IsOptional()
    @IsString()
    description?: string;
}
