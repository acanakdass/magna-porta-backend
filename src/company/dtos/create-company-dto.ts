import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({
        description: 'Company name',
        example: 'Tech Corp',
    })
    @IsString()
    name: string;
}
