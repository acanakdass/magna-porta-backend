import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {PaginatedResponseDto, PaginationDto} from '../common/models/pagination-dto';
import {UpdateUserDto} from "./dtos/update-user-dto";
import {CreateUserDto} from "./dtos/create-user-dto";
import {ApiBaseResponseDecorator} from "../common/decorators/api-base-response.decorator";
import {UserEntity} from "./user.entity";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBaseResponseDecorator(PaginatedResponseDto<UserEntity>)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllWithPagination({...paginationDto});
  }
  @ApiBaseResponseDecorator(PaginatedResponseDto<UserEntity>)
  @Get('paginated')
  async findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.usersService.listUsersPaginated({...paginationDto});
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneDynamic({ id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: number) {
    return this.usersService.activate(id);
  }
}