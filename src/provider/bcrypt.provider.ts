import * as bcrypt from 'bcrypt';

import { IHasher } from 'src/core/domain/interfaces/providers/bcrypt.provider.interface';

export class Hasher implements IHasher {
    async hash(plainText: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(plainText, saltRounds);
    }

    async compare(plainText: string, hashedText: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hashedText);
    }
}