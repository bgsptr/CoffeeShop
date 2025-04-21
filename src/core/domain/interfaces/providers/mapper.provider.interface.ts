export interface IMapper<Input, Output> {
    mapFromDto?(input: Input, ...args: any): Output;
    mapFromEntity?(...args: any): Input;
    mapToResponseJson?(...args: any): any;
}