import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = pinoHttp({
    quietReqLogger: true,
    autoLogging: true,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) {
        return "error";
      }
      if (res.statusCode >= 400) {
        return "warn";
      }
      return "info";
    },
    serializers: {
      req(req) {
        return { method: req.method, url: req.url };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  });

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger(req, res);
    next();
  }
}
