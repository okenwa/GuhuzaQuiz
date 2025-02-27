import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const credentialProvider = CredentialsProvider({
    name: 'guhuza',
    credentials: {
        userId: { label: "User ID", type: "text" },
        token: { label: "Token", type: "text" }
    },
    async authorize(credentials) {
        if (credentials?.userId && credentials?.token) {
            const response = await fetch(`${process.env.GUHUZA_API}/member/${credentials.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${credentials.token}`
                },
            })
            const user = await response.json()
            if (response.ok && user) {
                return {
                    id: user.id,
                    name: user.firstName + " " + user.lastName,
                    email: user.emailAddress,
                }
            } else {
                return null
            }
        }
        return null
    },
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        credentialProvider
    ],
})

