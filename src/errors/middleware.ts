import { Request, Response, NextFunction } from 'express';

// error handling middlewear
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  var status = err.status || err.statusCode || err.code;
  return res.status(status >= 100 && status < 600 ? status : 500).send({
    error: {
      type: err.name || err.type,
      message: err.message
    }
  });
}
