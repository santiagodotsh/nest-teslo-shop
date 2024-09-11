import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength
} from 'class-validator'

export class SignupUserDto {
  @IsString()
  @IsEmail()
  email: string

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

  @IsString()
  @MinLength(1)
  fullName: string
}
