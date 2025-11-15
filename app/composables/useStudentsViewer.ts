export const useStudents = () => {
  const supabase = useSupabaseClient()

  /**
   * Fetch student with relational data:
   * enrollments -> majors -> programs -> colleges
   */
  const getStudentProfile = async (id: string) => {
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        *,
        enrollments (
          id,
          enrollment_year,
          status,
          major_id,
          majors (
            id,
            name,
            program_id,
            programs (
              id,
              name,
              code,
              college_id,
              colleges (
                id,
                name,
                description
              )
            )
          )
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching student:', error)
      throw error
    }

    // Normalize the data for easier access
    const enrollment = data.enrollments?.[0] || null
    const major = enrollment?.majors
    const program = major?.programs
    const college = program?.colleges

    return {
      ...data,
      enrollment: {
        id: enrollment?.id,
        enrollment_year: enrollment?.enrollment_year,
        status: enrollment?.status,
        major: {
          id: major?.id,
          name: major?.name,
          program: {
            id: program?.id,
            name: program?.name,
            code: program?.code,
            college: {
              id: college?.id,
              name: college?.name,
              description: college?.description,
            },
          },
        },
      },
    }
  }

  return { getStudentProfile }
}
