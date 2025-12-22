import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private sensitiveFields = [
    'password',
    'newPassword',
    'confirmPassword',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'auth',
    'creditCard',
    'cvv',
    'ssn',
  ];

  // Helper to mask sensitive data in body/query/headers
  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sanitized = { ...data };
    for (const key in sanitized) {
      if (this.sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Log incoming request
    console.log(
      `[REQUEST] ${req.method} ${req.originalUrl} ` +
      `- IP: ${req.ip} ` +
      `- User-Agent: ${req.get('User-Agent') || 'unknown'}`,
    );

    // Optional: Log sanitized body/query if needed (useful for debugging)
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', this.sanitize(req.body));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log('Query:', this.sanitize(req.query));
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      const statusColor =
        statusCode >= 500
          ? '🔴'
          : statusCode >= 400
          ? '🟡'
          : statusCode >= 300
          ? '🔵'
          : statusCode >= 200
          ? '🟢'
          : '⚪';

      console.log(
        `[RESPONSE] ${req.method} ${req.originalUrl} ` +
        `${statusColor} ${statusCode} ` +
        `- ${duration}ms`,
      );
    });

    next();
  }
}