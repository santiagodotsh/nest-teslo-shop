import { existsSync, promises as fs } from 'fs'
import { extname, join } from 'path'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid  } from 'uuid'

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadLocalImage(file: Express.Multer.File) {
    const uploadPath = join(__dirname, '..', '..', 'static', 'uploads')

    await fs.mkdir(uploadPath, { recursive: true })

    const ext = extname(file.originalname)
    const fileName = uuid() + ext

    const filePath = join(uploadPath, fileName)

    await fs.writeFile(filePath, file.buffer)

    return {
      secureUrl: `${this.configService.get('HOST_API')}/files/product/${fileName}`
    }
  }

  getLocalImage(imageName: string) {
    const imagePath = join(__dirname, '..', '..', 'static', 'uploads', imageName)

    if(!existsSync(imagePath))
      throw new BadRequestException(`Product image ${imageName} not found`)

    return imagePath
  }
}
