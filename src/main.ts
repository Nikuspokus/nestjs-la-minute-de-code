import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module.js';
// import { AuthGuard } from './common/guards/auth.guard.js';
import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  try {
    process.loadEnvFile();
  } catch {
    // pas de .env (ex: prod avec variables injectées par la plateforme)
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new AuthGuard());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 60,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET!,
    getSessionIdentifier: (req) => req.ip ?? '',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
