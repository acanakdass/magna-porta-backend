import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {BaseApiResponse} from "../dto/api-response-dto";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        //todo add loggin to db or file or seq...
        console.error(`[${status}] ${request.method} ${request.url}`);
        console.error('Exception message:', exception.message || message);
console.info("error handler working: "+message)
console.info("error handler working2: "+exception)
console.error(JSON.stringify(exception))
        var errResult= new BaseApiResponse<any>()
        errResult.success=false;
        errResult.message=message as string;
        errResult.data=exception;
        response.status(status).json(errResult);
    }
}