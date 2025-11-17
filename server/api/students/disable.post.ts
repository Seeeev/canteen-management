import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body.email

  if (!email) {
    return { error: 'Email is required' }
  }

  const client = await serverSupabaseClient(event)

  // 1. Find student in database
  const { data: student, error: studentErr } = await client
    .from('students')
    .select('*')
    .eq('email', email)
    .single()

  if (studentErr || !student) {
    return { error: 'Student not found' }
  }

  // 2. Get all auth users (because supabase doesn't have "get user by email")
  const { data: users, error: listErr } = await client.auth.admin.listUsers()

  if (listErr) return { error: listErr.message }

  const authUser = users.users.find((u) => u.email === email)

  if (!authUser) {
    return { error: 'Auth user not found' }
  }

  // 3. Disable login by adding app_metadata.disabled = true
  const { error: updateUserErr } = await client.auth.admin.updateUserById(authUser.id, {
    app_metadata: {
      ...authUser.app_metadata,
      disabled: true,
    },
  })

  if (updateUserErr) {
    return { error: 'Failed to disable auth user: ' + updateUserErr.message }
  }

  // 4. Update student status to inactive
  const { error: updateStudentErr } = await client
    .from('students')
    .update({ enrollment_status: 'inactive' })
    .eq('id', student.id)

  if (updateStudentErr) {
    return { error: 'Failed to update student status' }
  }

  return { success: true, message: 'Student successfully disabled.' }
})
