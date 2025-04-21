export class ResponseDto {
    constructor(
        public error: boolean,
        public status_codes: number,
        public message: string,
        public result: any,
        // public status?: number
    ) {}
}