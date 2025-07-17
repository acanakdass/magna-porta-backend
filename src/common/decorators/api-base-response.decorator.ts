import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * ApiBaseResponse: Swagger'da bir response türünü otomatik belirtmek için
 * @param model Swagger için kullanacağımız DTO tipi
 */
export const ApiBaseResponseDecorator = <TModel extends Type<unknown>>(model: TModel) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(model) },
                    {
                        properties: {
                            success: { type: 'boolean', example: true },
                            message: { type: 'string', example: 'Request succeeded' },
                        },
                    },
                ],
            },
        }),
    );
};