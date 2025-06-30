import 'express';
import ResponseHandler from '../../common/utils/rh-reponse';

declare module 'express-serve-static-core' {
  interface Response {
    RH: ResponseHandler;
  }
}
