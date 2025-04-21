import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

@WebSocketGateway(3001, { namespace: "chat" })

export class ChatbotGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    }

    private async getAIResponse(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent([prompt]);
            return result.response.text();
        } catch (error) {
            console.error("AI Response Error:", error);
            return "Sorry, I couldn't generate a response.";
        }
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('join-room')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
        client.join(room);
        console.log(`Client with id ${client.id} join room ${room}`);
        this.server.to(room).emit('system message', `User joined ${room}`)
    }

    @SubscribeMessage('leave-room')
    handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
        client.leave(room);
        console.log(`Client with id ${client.id} left room ${room}`);
        this.server.to(room).emit('system message', `User left ${room}`);
    }

    @SubscribeMessage('chat message')
    async handleClientChat(@MessageBody() message: string) {
        console.log("request: ", message);

        // TODO: make room name dynamic
        this.server.to("room-1").emit('chat message', message);

        const response = await this.getAIResponse(message);
        this.server.to("room-1").emit('response message', response);
    }

    // @SubscribeMessage('response message')
    // async handleResponseChat(@MessageBody() message: string) {
    //     console.log("response: ", message);

    //     const response = await this.getAIResponse(message);
    //     // TODO: make room name dynamic
    //     this.server.to("room-1").emit('response message', response);
    // }
}