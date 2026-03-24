import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const DEMO_USERS = [
  {
    id: 'teacher-1',
    email: 'teacher1@waypoint.edu',
    password: 'password123',
    name: 'Sarah Johnson',
    gradeRange: 'Grades 3-5',
    school: 'Lincoln Elementary',
  },
  {
    id: 'teacher-2',
    email: 'teacher2@waypoint.edu',
    password: 'password123',
    name: 'Marcus Williams',
    gradeRange: 'Grades 6-8',
    school: 'Lincoln Elementary',
  },
]

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = DEMO_USERS.find(u => u.email === credentials.email)
        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          gradeRange: user.gradeRange,
          school: user.school,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.gradeRange = (user as any).gradeRange
        token.school = (user as any).school
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        ;(session.user as any).gradeRange = token.gradeRange as string
        ;(session.user as any).school = token.school as string
      }
      return session
    },
  },
}
