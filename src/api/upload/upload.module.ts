import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'D:/fep/upload/',
        filename: (req, file, callback) => {
          let originalName = file.originalname;

          // 处理 latin1 → utf8 乱码
          originalName = Buffer.from(originalName, 'latin1').toString('utf8');

          // 清理不安全字符，防止文件名过长或含特殊符号
          const nameWithoutExt = originalName.replace(
            extname(originalName),
            '',
          );
          const safeName = nameWithoutExt
            .replace(/[^a-zA-Z0-9\u4e00-\u9fa5._-]/g, '_') // 只保留中英文、数字、下划线、点、横线
            .trim();

          const extension = extname(originalName);
          const finalFilename = `${safeName}-${Date.now()}${extension}`;

          callback(null, finalFilename);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
