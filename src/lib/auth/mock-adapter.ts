import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/adapters"

/**
 * Mock Adapter for NextAuth/StackAuth
 * 
 * Simulates database interactions for development and testing without a real database.
 * Specifically handles the "mock" token flow for Story 1.1.
 */
export function MockAdapter(): Adapter {
    let users: AdapterUser[] = []
    let accounts: AdapterAccount[] = []
    let sessions: AdapterSession[] = []
    let verificationTokens: { identifier: string; token: string; expires: Date }[] = []

    // --- Mock Specific Logic --- 

    // Pre-seed a mock token for Story 1.1 (AC#3)
    const MOCK_EMAIL = "mock@example.com" // Can be anything for the mock flow
    const MOCK_TOKEN = "mocktoken123" // Simulate a generated token
    const MOCK_EXPIRES = new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
    verificationTokens.push({ identifier: MOCK_EMAIL, token: MOCK_TOKEN, expires: MOCK_EXPIRES })

    // --- Adapter Methods --- 

    const getUser = async (id: string): Promise<AdapterUser | null> => {
        console.log("[MockAdapter] getUser (internal):", id)
        return users.find((u) => u.id === id) ?? null
    }

    return {
        async createUser(user: Omit<AdapterUser, "id">) {
            console.log("[MockAdapter] createUser:", user)
            const newUser = { ...user, id: crypto.randomUUID() }
            users.push(newUser)
            return newUser
        },
        getUser: getUser,
        async getUserByEmail(email: string): Promise<AdapterUser | null> {
            console.log("[MockAdapter] getUserByEmail:", email)
            return users.find((u) => u.email === email) ?? null
        },
        async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<AdapterUser | null> {
            console.log("[MockAdapter] getUserByAccount:", { providerAccountId, provider })
            const account = accounts.find(
                (a) => a.provider === provider && a.providerAccountId === providerAccountId
            )
            if (!account) return null
            const user = await getUser(account.userId)
            return user ?? null
        },
        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
            console.log("[MockAdapter] updateUser:", user)
            const userIndex = users.findIndex((u) => u.id === user.id)
            if (userIndex === -1) throw new Error("User not found")
            users[userIndex] = { ...users[userIndex], ...user } as AdapterUser
            return users[userIndex]
        },
        async deleteUser(userId: string): Promise<void> {
            console.log("[MockAdapter] deleteUser:", userId)
            const userIndex = users.findIndex((u) => u.id === userId)
            if (userIndex !== -1) users.splice(userIndex, 1)
            // Also clean up related accounts and sessions
            accounts = accounts.filter((a) => a.userId !== userId)
            sessions = sessions.filter((s) => s.userId !== userId)
        },
        async linkAccount(account: AdapterAccount): Promise<AdapterAccount | null | undefined> {
            console.log("[MockAdapter] linkAccount:", account)
            const newAccount = { ...account, id: crypto.randomUUID() }
            accounts.push(newAccount)
            return newAccount
        },
        async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<void> {
            console.log("[MockAdapter] unlinkAccount:", { providerAccountId, provider })
            accounts = accounts.filter(
                (a) => !(a.provider === provider && a.providerAccountId === providerAccountId)
            )
        },
        async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
            console.log("[MockAdapter] createSession:", session)
            let newSession: AdapterSession & { role?: string; organizationId?: string } = {
                ...session
            }

            // --- Story 1.1 Specific Session --- 
            const user = await getUser(session.userId)
            if (user?.email === MOCK_EMAIL) {
                console.log(`[MockAdapter] Injecting mock admin role/org for ${user.email}`)
                newSession.role = "admin"
                newSession.organizationId = "org_mock_123"
            }
            // --- End Story 1.1 Specific --- 

            sessions.push(newSession)
            return newSession
        },
        async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
            console.log("[MockAdapter] getSessionAndUser:", sessionToken)
            const session = sessions.find((s) => s.sessionToken === sessionToken)
            if (!session) return null
            const user = await getUser(session.userId)
            if (!user) return null
            // Ensure the returned user object matches AdapterUser type exactly if needed
            const adapterUser: AdapterUser = { ...user }
            return { session, user: adapterUser }
        },
        async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> {
            console.log("[MockAdapter] updateSession:", session)
            const sessionIndex = sessions.findIndex((s) => s.sessionToken === session.sessionToken)
            if (sessionIndex === -1) return null
            sessions[sessionIndex] = { ...sessions[sessionIndex], ...session } as AdapterSession
            return sessions[sessionIndex]
        },
        async deleteSession(sessionToken: string): Promise<void> {
            console.log("[MockAdapter] deleteSession:", sessionToken)
            const sessionIndex = sessions.findIndex((s) => s.sessionToken === sessionToken)
            if (sessionIndex !== -1) sessions.splice(sessionIndex, 1)
        },
        async createVerificationToken(token: VerificationToken): Promise<VerificationToken | null | undefined> {
            console.log("[MockAdapter] createVerificationToken:", token)
            // Remove existing token for the identifier if any
            verificationTokens = verificationTokens.filter(vt => vt.identifier !== token.identifier)
            verificationTokens.push(token)
            return token
        },
        async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
            console.log("[MockAdapter] useVerificationToken:", { identifier, token })

            // --- Story 1.1 Specific Token Handling ---
            if (identifier === MOCK_EMAIL && token === MOCK_TOKEN) {
                console.log("[MockAdapter] Using hardcoded mock verification token.")
                const mockVT = verificationTokens.find(vt => vt.identifier === MOCK_EMAIL && vt.token === MOCK_TOKEN)
                verificationTokens = verificationTokens.filter(vt => !(vt.identifier === MOCK_EMAIL && vt.token === MOCK_TOKEN))
                return mockVT ?? null
            }
            // --- End Story 1.1 Specific ---

            const tokenIndex = verificationTokens.findIndex(
                (vt) => vt.identifier === identifier && vt.token === token
            )
            if (tokenIndex === -1) return null

            const verificationToken = verificationTokens[tokenIndex]
            if (verificationToken.expires < new Date()) {
                console.log("[MockAdapter] Verification token expired")
                verificationTokens.splice(tokenIndex, 1)
                return null
            }

            // Delete the token after successful use
            verificationTokens.splice(tokenIndex, 1)
            return verificationToken
        },
    }
} 