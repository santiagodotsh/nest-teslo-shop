import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { FilesService } from './files.service'
import { ProductImage } from '../products/entities/product-image.entity'

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({
    status: 201,
    description: 'File was saved'
  })
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 ** 2 }), // 1 MB
          new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.filesService.uploadLocalImage(file)
  }

  @Get('product/:imageName')
  @ApiResponse({
    status: 200,
    description: 'Found image',
    type: ProductImage
  })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const imagePath = this.filesService.getLocalImage(imageName)

    res.sendFile(imagePath)
  }
}
