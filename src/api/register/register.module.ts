import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterEntity } from './entities/register.entity';

@Module({
  controllers: [RegisterController],
  imports: [TypeOrmModule.forFeature([RegisterEntity])],
  providers: [RegisterService],
})
export class RegisterModule {}
