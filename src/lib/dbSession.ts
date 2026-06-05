import 'server-only'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import Session from '@/models/Session'
import { encrypt } from '@/lib/session'

export async function createSession(userId: string) {
  await dbConnect()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const sessionDoc = await Session.create({
    userId,
    expiresAt,
  })

  const sessionId = sessionDoc.id || sessionDoc._id.toHexString()

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session ID in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('kdp_session_id', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('kdp_session_id')?.value
  
  if (sessionToken) {
    const { decrypt } = await import('@/lib/session')
    const payload = await decrypt(sessionToken)
    if (payload?.sessionId) {
      await dbConnect()
      await Session.findByIdAndDelete(payload.sessionId)
    }
  }

  cookieStore.delete('kdp_session_id')
}
