export enum RegisterKey {
    email = "email",
    password = "password"
}

export class RegisterDto {
    constructor(public email: string, public password: string) {}

    set(key: RegisterKey, value: string): void {
        this[key] = value;
    }
}