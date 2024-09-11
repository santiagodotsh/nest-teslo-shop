import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'
import { User } from '../entities/user.entity'

export const GetUSer = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { user }: { user: User } = ctx.switchToHttp().getRequest()

    if(!user)
      throw new InternalServerErrorException('User not found (request)')

    return (!data)
      ? user
      : user[data]
  }
)