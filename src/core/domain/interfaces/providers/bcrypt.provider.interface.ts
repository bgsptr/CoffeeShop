export interface IHasher {
    compare(plainText: string, hashedText: string): Promise<boolean>;
    hash(plainText: string): Promise<string>;
}