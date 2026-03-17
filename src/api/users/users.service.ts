import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 根据ID查找用户
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  // 根据email查找用户
  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  // 更新用户的refresh token
  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    expires?: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken,
      refreshTokenExpires:
        expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  // 清除用户的refresh token
  async clearRefreshToken(userId: number): Promise<void> {
    const user: { refreshToken?: string; refreshTokenExpires?: Date } =
      await this.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      user.refreshTokenExpires = undefined;
    }
  }
}
