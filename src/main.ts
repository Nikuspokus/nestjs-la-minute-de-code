import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module.js';
// import { AuthGuard } from './common/guards/auth.guard.js';

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
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
