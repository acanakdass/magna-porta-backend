import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseApiResponse } from '../dto/api-response-dto';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Durum kodunu belirle
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Mesajı belirle (string formatta dönmesi sağlanır)
        let message = 'Internal server error';
        if (exception instanceof HttpException) {
            const responseMessage = exception.getResponse();
            message = typeof responseMessage === 'string'
                ? responseMessage
                : (responseMessage as any)?.message || 'Internal server error';
        } else if (exception.message) {
            message = exception.message;
        }

        // Loglama (istek, durum, ve hata detayları)
        console.error(`[${status}] ${request.method} ${request.url}`);
        console.error('Exception Message:', message);
        console.error('Exception Stack:', exception.stack);

        // Response için düzenleme
        const errorResponse: BaseApiResponse<any> = {
            success: false,
            message: message, // Düzgün salt bir mesaj dönülür
            data: {
                name: exception.name || null,
                statusCode: status,
                ...(exception.response || {}),
            }, // Hata detayı sadeleştirilerek burada döndürülür
        };

        // Hata responsu döndür
        response.status(status).json(errorResponse);
    }
}