import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { Response, Request } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ){}

  catch(exception: Error, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp()
    
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>()

    if (!(exception instanceof HttpException)) { 
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    console.log(response)
    const log = {
        timestamp: new Date(),
        message: typeof response === 'object' ? `url:${req.url}, ${response['message']}` : `url:${req.url}, ${response}`
    };
    
    this.logger.error(log)
    
    

    res.status((exception as HttpException).getStatus()).json(response)
  }
}
