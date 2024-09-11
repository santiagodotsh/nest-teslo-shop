import { IncomingHttpHeaders } from 'http'
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { GetUSer } from './decorators/get-user.decorator'
import { RawHeaders } from './decorators/raw-headers.decorator'
import { User } from './entities/user.entity'
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

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUSer() user: User,
    @GetUSer('email') email: string,
    @RawHeaders() rawHeaders: string,
    @Headers() headers: IncomingHttpHeaders
  ) {
    return {
      user,
      email,
      rawHeaders,
      headers
    }
  }
}
