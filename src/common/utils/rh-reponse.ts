import { Response } from 'express';

export interface RHResponse extends Response {
  RH: ResponseHandler;
}
export interface ResOffsetPagination<T> {
  data: T[];
  currentPage: number;
  totalPage: number;
  totalItems?: number;
}

export interface ResCursorPagination<T> {
  data: T[];
  hasMore: boolean;
  options?: Record<string, any>;
}

type CustomError = {
  message: string;
  code?: string;
};
export default class ResponseHandler {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  success(data?: any, status?: number): Response {
    const responseBody: { success: true; payload?: unknown } = {
      success: true,
    };

    if (data !== undefined) {
      responseBody.payload = data as unknown;
    }
    return this.res.status(status ?? 200).json(responseBody);
  }

  errorparam(data: { status: number; error: CustomError }): Response {
    return this.res.status(data.status).json({
      status: data.status,
      success: false,
      error: data.error,
    });
  }

  error(error: { statusCode?: number; [key: string]: any }): Response {
    if (process.env.NODE_ENV === 'development') {
      console.log('error : ', error);
    }
    return this.res.status(error.statusCode || 500).json(error);
  }

  paging<T>(pagingData: ResOffsetPagination<T>): Response {
    return this.res.status(200).json({
      success: true,
      payload: pagingData,
    });
  }

  infinity<T>(cursorData: ResCursorPagination<T>): Response {
    return this.res.status(200).json({
      success: true,
      payload: cursorData,
    });
  }
}
