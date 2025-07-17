import {ApiProperty} from "@nestjs/swagger";

export class RegisterResponseDto {
    @ApiProperty({description: 'Email of the user', example: 'user@example.com'})
    email!: string;

    @ApiProperty({description: 'Role name of the user', example: 'administrator'})
    roleName!: string;
}