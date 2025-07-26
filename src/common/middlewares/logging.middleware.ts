import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from '../../logs/logs.service';
import { LogEntity } from '../../logs/log.entity';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly logsService: LogsService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // const loggableEndpoints = ['/users', '/auth/login']; // Loglanacak endpoint'ler
        // const currentEndpoint = req.originalUrl.split('?')[0];
        //
        // // Eğer loglanacak endpoint değilse, bir şey yapmadan devam et
        // if (!loggableEndpoints.includes(currentEndpoint)) {
        //     return next();
        // }

        const now = Date.now();
        const originalSend = res.send; // Orijinal `res.send` metodunu sakla

        let responseBody: any; // Yanıt gövdesini yakalamak için bir değişken oluştur
        res.send = (body: any) => {
            try {
                responseBody = typeof body === 'string' ? JSON.parse(body) : body;
            } catch (error) {

                responseBody = body;
            }

            return originalSend.call(res, body);
        };

        res.on('finish', async () => {
            try {
                const log: LogEntity = {
                    isDeleted: false,
                    level: res.statusCode >= 500 ? 'error' : 'info', // Durum koduna göre log seviyesi belirleme
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    ip: req.ip,
                    message: 'HTTP Request and Response logged',
                    userAgent: req.headers['user-agent'] || null,
                    serviceName: 'YourServiceName',
                    environment: process.env.NODE_ENV || ('development' as any),
                    executionTime: Date.now() - now, // İstek ve yanıt arasındaki süre
                    metadata: {
                        requestHeaders: req.headers,
                        requestQuery: req.query,
                        requestParams: req.params,
                        requestBody: req.body,
                    },
                    responseBody: responseBody
                };

                // console.log('Log kaydediliyor:', log.metadata);

                await this.logsService.createLog(log); // Logu veritabanına kaydet
            } catch (error) {
                console.error('Log kaydedilemedi:', error.message);
            }
        });

        next();
    }
}