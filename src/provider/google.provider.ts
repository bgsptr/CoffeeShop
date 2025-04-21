import { Provider } from "@nestjs/common";
import { google } from "googleapis";
import { googleVariable } from "src/core/contants/variable";

export const GoogleProvider: Provider = {
    provide: "GOOGLE_OAUTH",
    useFactory: () => {
        return new google.auth.OAuth2(
            // googleVariable.GOOGLE_CLIENT_ID,
            // googleVariable.GOOGLE_CLIENT_SECRET,
            // googleVariable.DASHBOARD_REDIRECT_URL

            "799300494910-u552fdar3nk1oudbcgs03708iu0l3p8a.apps.googleusercontent.com",
            "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",
            "http://localhost:3000/users/auth/google/callback"
        )
    }
}