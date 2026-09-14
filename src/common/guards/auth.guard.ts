import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly expectedToken = process.env.AUTH_TOKEN;

  canActivate(context: ExecutionContext): boolean {
    if (!this.expectedToken) {
      throw new Error('AUTH_TOKEN environment variable is not set');
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token || token !== this.expectedToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
