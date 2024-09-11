import { Reflector } from '@nestjs/core'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { User } from '../entities/user.entity'

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | never {
    const validRoles: string[] = this.reflector.get('roles', ctx.getHandler())

    if(!validRoles) return true
    if(validRoles.length === 0) return true

    const { user }: { user: User } = ctx.switchToHttp().getRequest()

    if(!user)
      throw new InternalServerErrorException('User not found (request)')
    
    for(const role of user.roles) {
      if(validRoles.includes(role)) return true
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role`)
  }
}
