export type AppEnv = {
  port: number;
  webOrigin: string;
  jwtSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
};

export function readEnv(): AppEnv {
  return {
    port: Number(process.env.PORT ?? 3000),
    webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-only-change-me',
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? 'not-configured',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'not-configured',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3000/auth/google/callback',
  };
}
