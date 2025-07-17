import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
import {PermissionsService} from "./permissions.service";
import {ApiTags} from "@nestjs/swagger";
import {ApiBaseResponseDecorator} from "../common/decorators/api-base-response.decorator";
import {PaginatedResponseDto, PaginationDto} from "../common/models/pagination-dto";
import {UserEntity} from "../users/user.entity";
import {PermissionEntity} from "./permission.entity";
import {PermissionCreateDto} from "./dtos/PermissionCreateDto";
import {PermissionUpdateDto} from "./dtos/PermissionUpdateDto";

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {
    }

    @ApiBaseResponseDecorator(PaginatedResponseDto<PermissionEntity>)
    @Get('paginated')
    async findAllPaginated(@Query() paginationDto: PaginationDto) {
        return this.permissionsService.listPaginated({...paginationDto});
    }
    @Get()
    async getPermissions() {
        return this.permissionsService.getPermissions();
    }

    @Get('roles')
    async getRoles() {
        return this.permissionsService.getRoles();
    }
    @Post()
    async create(@Body() dto: PermissionCreateDto) {
        return this.permissionsService.create(dto);
    }
    @Post("/update")
    async update(@Body() dto: PermissionUpdateDto) {
        return this.permissionsService.update(dto.id,dto);
    }

    @Post('assign/:roleId/:permissionId')
    async assignPermissionToRole(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('permissionId', ParseIntPipe) permissionId: number,
    ) {
        return this.permissionsService.assignPermissionToRole(roleId, permissionId);
    }
}

