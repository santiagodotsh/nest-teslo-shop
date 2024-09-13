import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength
} from 'class-validator'

export class SigninUserDto {
  @ApiProperty({
    description: 'User email',
    uniqueItems: true
  })
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'User password',
    minLength: 1
  })
  @IsString()
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }, {
    message: 'password must include uppercase, lowercase, number, and special character'
  })
  password: string
}
