import { Provider } from "@nestjs/common";
import { google } from "googleapis";
import { googleVariable } from "src/core/contants/variable";

export const GoogleProvider: Provider = {
    provide: "GOOGLE_OAUTH",
    useFactory: () => {
        return new google.auth.OAuth2(
            googleVariable.GOOGLE_CLIENT_ID,
            googleVariable.GOOGLE_CLIENT_SECRET,
            googleVariable.DASHBOARD_REDIRECT_URL
        )
    }
}