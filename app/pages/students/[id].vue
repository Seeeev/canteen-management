<template>
  <div class="max-w-3xl mx-auto py-8 space-y-6">
    <UPageHeader
      title="Student Profile"
      description="View student information and enrollment details"
    />
    <StudentProfileCard :student="student" v-if="student" />
    <EnrollmentCard :enrollment="student.enrollment" v-if="student?.enrollment" />
  </div>
</template>

<script setup lang="ts">
import StudentProfileCard from '~/components/student/StudentProfileCard.vue'
import EnrollmentCard from '~/components/student/EnrollmentCard.vue'
import { useStudents } from '~/composables/useStudentsViewer'

const route = useRoute()
const { getStudentProfile } = useStudents()
const student = ref<any>(null)

onMounted(async () => {
  student.value = await getStudentProfile(route.params.id as string)
})
</script>
