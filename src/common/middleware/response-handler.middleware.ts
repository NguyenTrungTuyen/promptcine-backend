import { Injectable, NestMiddleware } from '@nestjs/common';
import ResponseHandler from '../utils/rh-reponse';

@Injectable()
export class ResponseHandlerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.RH = new ResponseHandler(res);
    next();
  }
}
