// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import { Logger } from '@nestjs/common';
// import { Request, Response } from 'express';
//
// @Catch()
// export class GlobalLogFilter implements ExceptionFilter {
//     private readonly logger = new Logger(GlobalLogFilter.name);
//
//     catch(exception: any, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const request = ctx.getRequest<Request>();
//         const response = ctx.getResponse<Response>();
//
//         const isHttpException = exception instanceof HttpException;
//         const status = isHttpException
//             ? exception.getStatus()
//             : exception.response?.status || 500;
//
//         let errorMessage = 'Internal Server Error';
//         let errorDetails: any = null;
//
//         if (isHttpException) {
//             // NestJS HttpException yapısı üzerinden veri alınıyor
//             errorMessage = (exception.getResponse() as any)?.message || exception.message;
//             errorDetails = (exception.getResponse() as any) || null;
//         } else if (exception.response?.data) {
//             // Axios hataları için durum (status) ve veri (data)
//             errorMessage = exception.response.data.message || exception.message;
//             errorDetails = exception.response.data;
//         } else {
//             // Genel hatalar
//             errorMessage = exception.message || 'Internal Server Error';
//             errorDetails = exception.stack || null;
//         }
//
//         // Loglama
//         this.logger.error(
//             `Error occurred during request: ${request.method} ${request.url}`,
//             errorDetails,
//         );
//
//         // Response döndürme
//         response.status(status).json({
//             statusCode: status,
//             error: errorMessage,
//             path: request.url,
//             timestamp: new Date().toISOString(),
//         });
//     }
// }