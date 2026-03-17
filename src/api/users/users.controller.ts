import { Body, Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from '@/entities/user.entity';
import { RegisterDto } from '@/dto/register.dto';
import { RegisterService } from '@/api/register/register.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly registerService: RegisterService,
  ) {}

  // 获取所有用户
  @Get('list')
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  // 添加用户
  @Post('create')
  async create(@Body() userDto: RegisterDto): Promise<UserEntity> {
    return this.registerService.register(userDto);
  }

  // 更新用户
  @Post('update')
  async update(@Body() userInfo: UserEntity): Promise<UserEntity> {
    console.log('更新用户', userInfo);
    return this.usersService.update(userInfo);
  }

  // 删除用户
  @Post('delete')
  async delete(@Body() body: { id: number }): Promise<void> {
    return this.usersService.delete(body.id);
  }
}
