import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

export function AutoSwaggerTags(controllerName: string, operationName: string) {
    return applyDecorators(
        ApiTags(controllerName),
        ApiOperation({ summary: operationName }),
    );
}