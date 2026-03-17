import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterModule } from './api/register/register.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core'; // 引入全局装饰器
import { ResultInterceptor } from '@/interceptor/result.interceptor'; // 引入全局拦截器

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
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局注册响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResultInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
