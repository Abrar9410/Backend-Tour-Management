import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    SALT: string;
    JWT_SECRET: string;
    JWT_EXPIRESIN: string;
    REFRESH_JWT_SECRET: string;
    REFRESH_JWT_EXPIRESIN: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string
};

const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "SALT", "JWT_SECRET", "JWT_EXPIRESIN", "REFRESH_JWT_SECRET", "REFRESH_JWT_EXPIRESIN", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        SALT: process.env.SALT as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRESIN: process.env.JWT_EXPIRESIN as string,
        REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET as string,
        REFRESH_JWT_EXPIRESIN: process.env.REFRESH_JWT_EXPIRESIN as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    };
}

export const envVars = loadEnvVariables();