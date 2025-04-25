import NextAuth from "next-auth"
import type { Provider } from "@auth/core/providers"
import EmailProvider from "next-auth/providers/email"
import type { SendVerificationRequestParams } from "next-auth/providers/email"
import { Resend } from "resend"
import { MockAdapter } from "@/lib/auth/mock-adapter"

const resend = new Resend(process.env.RESEND_API_KEY)

// NOTE: Using MockAdapter for development/testing as per Story 1.1
// Remove or replace with a production adapter (e.g., Prisma) later.
const adapter = MockAdapter()

// TODO: Implement useAuthMock() adapter logic as described in story 1.1
// This mock adapter should handle token validation, user creation/lookup,
// and session generation, particularly for the '/auth/callback?token=mock' scenario.
// For now, basic Email provider setup.

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: adapter,
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest(params: SendVerificationRequestParams) {
                const { identifier: email, url, provider: { from } } = params;
                try {
                    await resend.emails.send({
                        from: from!,
                        to: email,
                        subject: "Sign in to CFIPros", // Updated subject
                        html: `<p>Welcome to CFIPros!</p><p>Click the magic link below to sign in to your account:</p><p><a href="${url}"><strong>Sign In</strong></a></p><p>If you did not request this email, you can safely ignore it.</p>`,
                    });
                    console.log(`Verification email sent to ${email} via Resend.`);
                } catch (error) {
                    console.error("Failed to send verification email:", error);
                    // Optionally, re-throw a more user-friendly error or handle specific Resend errors
                    throw new Error("Failed to send verification email. Please try again later.");
                }
            },
        }),
        // TODO: Add other providers if needed (e.g., Google, GitHub)
    ],
    session: { strategy: "database" },
    pages: {
        signIn: '/auth/signin', // Redirect users to custom sign-in page
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
        async session({ session, user }) {
            if (user && session.user) {
                session.user.id = user.id
                session.user.role = (user as any).role
                session.user.organizationId = (user as any).organizationId
            }
            return session
        },
        // Potentially add jwt callback if using JWT strategy
    },
}) 