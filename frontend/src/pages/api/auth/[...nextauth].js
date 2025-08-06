import { decodeJwt } from '@/utils/authUtils'
import axios from 'axios'
import NextAuth, { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailid: { label: 'Emailid', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post('/login', {
            emailid: credentials?.emailid,
            password: credentials?.password
          })

          const token = response?.data?.token
          if (!token) return null

          const user = decodeJwt(token)
          if (!user) return null

          user.token = token
          return user
        } catch (error) {
          if (!error?.response?.data?.error) {
            console.error(error.cause || error)
            return null
          }
          throw new Error(encodeURIComponent(error.response.data.error))
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      session.user = token
      return session
    }
  },
  pages: {
    signIn: '/authentication/sign-in'
  }
}

export default NextAuth(authOptions)

export function auth(...args) {
  return getServerSession(...args, config)
}
