import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, InternalServerErrorException } from '@nestjs/common';
import { Response, Request } from 'express'
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { timestamp } from 'rxjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  constructor(){}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>()

    if(!(exception instanceof HttpException)){
      exception = new InternalServerErrorException()
    }

    const response = (exception as HttpException).getResponse()

    const log = {
      timestamp: new Date().toISOString(),
      url: req.url,
      response
    }

    console.error(JSON.stringify(log))

    res.status((exception as HttpException).getStatus())
    .json(response)
  }
}
