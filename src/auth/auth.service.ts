import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { hashSync, compareSync } from 'bcrypt'
import { User } from './entities/user.entity'
import { SignupUserDto } from './dto/signup-user.dto'
import { SigninUserDto } from './dto/signin-user.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) { }

  async signup(signupUserDto: SignupUserDto) {
    const { password, ...rest } = signupUserDto

    try {
      const user = this.userRepository.create({
        password: hashSync(password, 10),
        ...rest
      })

      await this.userRepository.save(user)

      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id})
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  
  async signin(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true
      }
    })

    if(!user)
      throw new UnauthorizedException('Invalid credentials (email)')

    if(!compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials (password)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id})
    }
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id})
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }

  private handleDBExceptions(error: any): never {
    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
