import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "../errors/domain.error";

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception.code === "INVALID_WEBHOOK_SIGNATURE"
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.UNPROCESSABLE_ENTITY;
    response.status(status).json({
      code: exception.code,
      message: exception.message,
      details: exception.details ?? null,
    });
  }
}
