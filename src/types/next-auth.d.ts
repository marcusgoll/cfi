import type { DefaultSession, User as DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

// Extend the built-in session/user types to include custom properties

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's id. */
            id: string;
            /** The user's role. */
            role?: string; // Optional based on your logic
            /** The user's organization ID. */
            organizationId?: string; // Optional based on your logic
        } & DefaultSession["user"]; // Keep existing properties like name, email, image

        // You can add other custom session properties here if needed
        // exampleProperty?: string;
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User extends DefaultUser {
        // Add custom properties returned by your adapter's getUser/createUser methods
        role?: string;
        organizationId?: string;
    }
}

// You can also extend the JWT type if you are using the JWT strategy
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** User ID */
        id?: string;
        /** User role */
        role?: string;
        /** Organization ID */
        organizationId?: string;
    }
} 