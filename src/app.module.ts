import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {LogsModule} from './logs/logs.module';
import {PermissionModule} from "./permission/permission.module";
import {RolesModule} from "./role/roles.module";
import {ExternalModule} from "./external/external.module";
import {CompaniesModule} from "./company/companies.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
            // logging: true,
        }),
        AuthModule,
        UsersModule,
        LogsModule,
        ExternalModule,
        PermissionModule,
        RolesModule,
        CompaniesModule
    ],
})
export class AppModule {
}