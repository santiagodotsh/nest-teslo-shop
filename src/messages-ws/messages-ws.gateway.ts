import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { JwtService } from '@nestjs/jwt'
import { Server, Socket } from 'socket.io'
import { MessagesWsService } from './messages-ws.service'
import { NewMessageDto } from './dto/new-message.dto'
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private webSocketServer: Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string

    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(token)

      await this.messagesWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()

      return
    }

    this.webSocketServer.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)

    this.webSocketServer.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, { message }: NewMessageDto) {
    const fullName = this.messagesWsService.getUserFullName(client.id)

    this.webSocketServer.emit('message-from-server', { fullName, message })
  }
}
