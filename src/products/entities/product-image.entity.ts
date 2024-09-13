import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Product } from './product.entity'

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    example: '463de95c-33fe-4921-b19a-90024022ca34',
    description: 'Image ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    example: '1549268-00-A_0_2000.jpg',
    description: 'Image url'
  })
  @Column('text')
  url: string

  @ManyToOne(
    () => Product,
    product => product.images,
    { onDelete: 'CASCADE' }
  )
  product: Product
}
