import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterModule } from './api/register/register.module';
import { LoginModule } from './api/login/login.module';

@Module({
  imports: [
    // 加载环境变量配置
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    // 配置 TypeORM 数据库连接
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development', // 开发环境自动同步表结构
        logging: configService.get('NODE_ENV') === 'development', // 开发环境打印 SQL 日志
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    RegisterModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
