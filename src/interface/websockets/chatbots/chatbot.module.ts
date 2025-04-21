import { Module } from "@nestjs/common";
import { ChatbotGateway } from "./chatbot.gateway";

@Module({
    providers: [ChatbotGateway]
})

export class ChatbotModule {}