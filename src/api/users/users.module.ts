import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';
import { UsersController } from './users.controller';
import { RegisterModule } from '@/api/register/register.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RegisterModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
