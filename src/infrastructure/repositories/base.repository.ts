import { PrismaClient } from "@prisma/client";

export class BaseRepository {
    constructor(protected readonly prisma: PrismaClient) {
        this.prisma = new PrismaClient();
    }
}