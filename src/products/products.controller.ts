import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { GetUSer } from '../auth/decorators/get-user.decorator'
import { User } from 'src/auth/entities/user.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from '../common/dto/pagination.dto'

@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUSer() user: User
  ) {
    return this.productsService.create(createProductDto, user)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto)
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUSer() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
