import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { googleVariable } from "src/core/contants/variable";

export const GoogleProvider: Provider = {
    provide: "GOOGLE_OAUTH",
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return new google.auth.OAuth2(
            // googleVariable.GOOGLE_CLIENT_ID,
            // googleVariable.GOOGLE_CLIENT_SECRET,
            // googleVariable.DASHBOARD_REDIRECT_URL

            configService.get("GOOGLE_CLIENT_ID"),
            configService.get("GOOGLE_CLIENT_SECRET"),
            configService.get("DASHBOARD_REDIRECT_URL")
        )
    }
}