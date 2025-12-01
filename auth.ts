import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    debug: true,
    // Fallback to hardcoded secret if env var fails
    secret: process.env.AUTH_SECRET || "complex_random_secret_string_here_at_least_32_chars",
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "1084934773968-peke8l6re7ie72teu7hptu25n8lsa94f.apps.googleusercontent.com",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOCSPX-d-Ix2BeEJZm11ONFpqh39n2kDts",
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Mock authentication for now if no real backend is ready
                // In production, verify against Firebase or your DB
                if (credentials?.email === "test@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "Test User", email: "test@example.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/signup",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && (nextUrl.pathname === "/auth/login" || nextUrl.pathname === "/auth/signup")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
});
