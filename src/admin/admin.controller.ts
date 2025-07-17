import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles('admin')
  getStats() {
    return this.adminService.getDashboardStats();
  }
}