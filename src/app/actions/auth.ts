'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { LoginFormSchema, FormState } from '@/lib/definitions'

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email: emailOrUsername, password } = validatedFields.data
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'

  try {
    await dbConnect()

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { name: emailOrUsername }
      ]
    })

    if (!user) {
      return { message: 'Invalid username/email or password' }
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      const oldCryptoHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')
        
      if (user.password === oldCryptoHash) {
        isPasswordCorrect = true
        user.password = await bcrypt.hash(password, 10)
        await user.save()
      }
    }

    if (!isPasswordCorrect) {
      return { message: 'Invalid username/email or password' }
    }

    const userId = user.id || user._id.toHexString()
    await createSession(userId)
    
  } catch (error: any) {
    console.error('Login action error:', error)
    return { message: 'An unexpected error occurred' }
  }
  
  redirect(callbackUrl)
}

export async function logout() {
  await deleteSession()
  redirect('/auth/login')
}
