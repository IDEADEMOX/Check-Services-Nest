import {
  Controller,
  Post,
  UseInterceptors,
  HttpCode,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      filename: file.filename,
      path: file.path,
    };
  }
}
