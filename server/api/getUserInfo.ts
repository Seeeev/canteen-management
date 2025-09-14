import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // get the email and use it to fetch user data from the users table
  const email = body.email

  const client = await serverSupabaseClient(event)
  const data = await client.from('users').select('*').eq('email', email).single()
  console.log(data)
  return data
  // Simulate a response (replace this with real DB lookup, etc.)
  // return {
  //   message: `User info for ${body.email}`,
  //   email: body.email,
  // }
})
