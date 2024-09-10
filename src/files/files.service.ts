import { promises as fs } from 'fs'
import { extname, join } from 'path'
import { Injectable } from '@nestjs/common'
import { v4 as uuid  } from 'uuid'

@Injectable()
export class FilesService {
  async uploadLocalImage(file: Express.Multer.File) {
    const uploadPath = join(__dirname, '..', '..', 'static', 'uploads')

    await fs.mkdir(uploadPath, { recursive: true })

    const ext = extname(file.originalname)
    const fileName = uuid() + ext

    const filePath = join(uploadPath, fileName)

    await fs.writeFile(filePath, file.buffer)

    return { image: fileName }
  }
}
