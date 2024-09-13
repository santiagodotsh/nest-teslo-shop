import { ApiProperty } from '@nestjs/swagger'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ProductImage } from './product-image.entity'
import { User } from '../../auth/entities/user.entity'

@Entity({ name: 'products'})
export class Product {
  @ApiProperty({
    example: '463de95c-33fe-4921-b19a-90024022ca34',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'Men\'s Plaid Mode Tee',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string

  @ApiProperty({
    example: 35,
    description: 'Product Price',
    default: 0
  })
  @Column('float', {
    default: 0
  })
  price: number

  @ApiProperty({
    example: 'Designed to celebrate Tesla\'s incredible performance mode, the Plaid Mode Tee features great fit, comfort and style. Made from 100% cotton, it\'s the next best thing to riding shotgun at the Nürburgring.',
    description: 'Product Description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @ApiProperty({
    example: 'men-plaid-mode-tee',
    description: 'Product Slug for SEO',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string

  @ApiProperty({
    example: 82,
    description: 'Product Stock',
    default: 0
  })
  @Column({
    type: 'int',
    default: 0
  })
  stock: number

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product Sizes'
  })
  @Column({
    type: 'text',
    array: true
  })
  sizes: string[]

  @ApiProperty({
    example: 'men',
    description: 'Product Gender'
  })
  @Column('text')
  gender: string

  @ApiProperty({
    example: ['shirt'],
    description: 'Product Tags'
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[]

  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[]

  @ManyToOne(
    () => User,
    user => user.products,
    { eager: true }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if(!this.slug)
      this.slug = this.title

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll('\'', '')
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll('\'', '')
  }
}
