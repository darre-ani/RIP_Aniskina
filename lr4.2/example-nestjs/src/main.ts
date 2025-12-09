// src/main.ts
import { NestFactory } from '@nestjs/core'; // ← критически важный импорт
import { AppModule } from './app.module';   // ← должен соответствовать вашей структуре
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';              // для корректной работы путей

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Настройка раздачи статики
  app.useStaticAssets(resolve(__dirname, '..', 'client'), {
    prefix: '/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();