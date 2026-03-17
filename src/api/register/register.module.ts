import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';

@Module({
  controllers: [RegisterController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
