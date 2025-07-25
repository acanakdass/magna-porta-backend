import {MiddlewareConsumer, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {LogsModule} from './logs/logs.module';
import {PermissionModule} from "./permission/permission.module";
import {RolesModule} from "./role/roles.module";
import {ExternalModule} from "./external/external.module";
import {CompaniesModule} from "./company/companies.module";
import {APP_FILTER} from "@nestjs/core";
import {GlobalHttpExceptionFilter} from "./common/filters/global-http-exception.filter";
// import {GlobalLogFilter} from "./common/filters/global-log.filter";
import {LoggingMiddleware} from "./common/middlewares/logging.middleware";

@Module({
    providers:[
        {
            provide:APP_FILTER,
            useClass:GlobalHttpExceptionFilter
        }
        // , {
        //     provide:APP_FILTER,
        //     useClass:GlobalLogFilter
        // }
    ],
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
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*'); // Tüm rotalar için
    }
}
