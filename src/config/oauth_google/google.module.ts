import { Module } from "@nestjs/common";
import { GoogleProvider } from "src/provider/google.provider";

@Module({
    providers: [GoogleProvider],
    exports: [GoogleProvider]
})

export class GoogleModule {

}