import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {PermissionEntity} from "./permission.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.permissions) {
            throw new ForbiddenException('User does not have sufficient permissions');
        }

        const hasPermission = requiredPermissions.every((perm) =>
            user.permissions.some(
                (userPerm: PermissionEntity) => userPerm.name === perm,
            ),
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                'User is denied access to this resource',
            );
        }

        return true;
    }
}