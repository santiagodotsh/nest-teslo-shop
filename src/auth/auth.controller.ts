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
import { UserRoleGuard } from './guards/user-role.guard'
import { GetUSer } from './decorators/get-user.decorator'
import { RawHeaders } from './decorators/raw-headers.decorator'
import { RoleProtected } from './decorators/role-protected.decorator'
import { Auth } from './decorators/auth.decorator'
import { User } from './entities/user.entity'
import { SignupUserDto } from './dto/signup-user.dto'
import { SigninUserDto } from './dto/signin-user.dto'
import { ValidRoles } from './interfaces/valid-roles'

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
  privateRoute(
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

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUSer() user: User) {
    return user
  }

  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(@GetUSer() user: User) {
    return user
  }
}
