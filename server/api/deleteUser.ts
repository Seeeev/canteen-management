import { createClient } from '@supabase/supabase-js'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required' })
  }

  // Create an admin Supabase client (server-side only)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key (never expose to frontend)
  )

  // Step 1: Find user by email
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()

  if (listError) {
    throw createError({ statusCode: 500, message: listError.message })
  }

  const user = users?.users?.find((u) => u.email === email)

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  // Step 2: Delete user by ID
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    throw createError({ statusCode: 500, message: deleteError.message })
  }

  return { success: true, deletedUserEmail: email }
})
