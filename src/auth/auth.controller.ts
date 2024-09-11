import {
  Controller,
  Post,
  Body
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupUserDto } from './dto/signup-user.dto'
import { SigninUserDto } from './dto/signin-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signupUser(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto)
  }

  @Post('signin')
  signinUser(@Body() signinUserDto: SigninUserDto) {
    return this.authService.signin(signinUserDto)
  }
}
