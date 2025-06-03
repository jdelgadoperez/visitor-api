import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.APP_PORT || 3005;
  if (process.env.NODE_CONFIG_ENV === 'dev') {
    await app.listen(port);
    console.log(`App listening at http://localhost:${port}`);
  } else {
    await app.listen(port, '0.0.0.0', () =>
      console.log(`App listening at http://0.0.0.0:${port}`),
    );
  }
}
bootstrap();
