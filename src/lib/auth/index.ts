import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

console.log("[auth init] BETTER_AUTH_SECRET length:", process.env.BETTER_AUTH_SECRET?.length);
console.log("[auth init] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "candidate",
                input: true,
            },
        },
    },
});

console.log("[auth init] auth object created, handler type:", typeof auth.handler);
