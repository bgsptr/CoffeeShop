import { Provider } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export const DecimalProvider: Provider = {
    provide: "DECIMAL_FACTORY",
    useValue: (value: number | string) => new Prisma.Decimal(value),
}