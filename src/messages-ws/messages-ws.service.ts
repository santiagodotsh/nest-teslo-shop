import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'

interface ConnectedClients {
  [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {}

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client
  }

  removeClient(id: string) {
    delete this.connectedClients[id]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients)
  }
}
