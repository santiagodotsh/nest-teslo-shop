import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { Repository } from 'typeorm'
import { User } from '../auth/entities/user.entity'

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  }
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {}

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if(!user) throw new Error('User not found')
    if(!user.isActive) throw new Error('User not active')

    this.checkUserConnection(user)

    this.connectedClients[client.id] = { socket: client, user }
  }

  removeClient(id: string) {
    delete this.connectedClients[id]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName
  }

  private checkUserConnection(user: User) {
    const clientValues = Object.values(this.connectedClients)

    for(const clientValue of clientValues) {

      if(clientValue.user.id === user.id) {
        clientValue.socket.disconnect()

        break
      }
    }
  }
}
