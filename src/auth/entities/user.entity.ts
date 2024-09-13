import { ApiProperty } from '@nestjs/swagger'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Product } from '../../products/entities/product.entity'

@Entity()
export class User {
  @ApiProperty({
    example: '29760dc2-7bdc-4dde-816d-66038c094813',
    description: 'User ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'example@email.com',
    description: 'User email',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  email: string

  @ApiProperty({
    example: 'abcABC123%$',
    description: 'User password'
  })
  @Column('text', {
    select: false
  })
  password: string

  @ApiProperty({
    example: 'Andrea Calderon',
    description: 'User name'
  })
  @Column('text')
  fullName: string

  @ApiProperty({
    example: true,
    description: 'User is active',
    default: true
  })
  @Column('bool', {
    default: true
  })
  isActive: boolean

  @ApiProperty({
    example: ['user'],
    description: 'User roles'
  })
  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[]

  @OneToMany(
    () => Product,
    product => product.user
  )
  products: Product[]

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert()
  }
}
