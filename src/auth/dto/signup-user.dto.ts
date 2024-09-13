import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength
} from 'class-validator'

export class SignupUserDto {
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

  @ApiProperty({
    description: 'User fullname',
    uniqueItems: true
  })
  @IsString()
  @MinLength(1)
  fullName: string
}
