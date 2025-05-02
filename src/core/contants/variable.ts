export const midtrans = {
    baseUrl: process.env.NODE_ENV === "development" ? "https://api.sandbox.midtrans.com" : "https://api.midtrans.com",
    serverKey: process.env.MIDTRANS_SERVER_KEY
}

export const googleVariable = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DASHBOARD_REDIRECT_URL: process.env.DASHBOARD_REDIRECT_URL
}