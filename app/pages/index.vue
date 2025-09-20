<script setup lang="ts">
// No special logic needed for a static landing page
const features = [
  {
    title: 'Cashless Convenience',
    description: 'Load credits and pay securely without cash.',
    icon: 'i-lucide-credit-card',
  },
  {
    title: 'Real-time Balance',
    description: 'Check your wallet balance anytime, anywhere.',
    icon: 'i-lucide-wallet',
  },
  {
    title: 'Fast Checkout',
    description: 'Skip long queues with instant QR payments.',
    icon: 'i-lucide-fast-forward',
  },
]

const router = useRouter()
const user = useSupabaseUser()

function handleGetStarted() {
  // If user is logged in, go to /student, else go to /login
  if (user.value) {
    router.push('/student')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- ===================== Hero Section ===================== -->
    <header class="bg-gradient-to-r from-red-500 to-red-950 text-white text-center py-20">
      <h1 class="text-4xl sm:text-6xl font-extrabold mb-4">Welcome to Siena E-Canteen</h1>
      <p class="text-lg sm:text-xl max-w-2xl mx-auto">
        Pay for your meals with ease. A faster, cashless campus canteen experience.
      </p>

      <div class="mt-8 flex justify-center gap-4">
        <UButton size="lg" color="white" @click="handleGetStarted"> Get Started </UButton>
        <UButton size="lg" variant="outline" color="white" to="/about"> Learn More </UButton>
      </div>
    </header>

    <!-- ===================== Features ===================== -->
    <main class="flex-1 bg-gray-50 py-16 px-6">
      <section class="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        <UCard v-for="feature in features" :key="feature.title" class="text-center p-6">
          <template #header>
            <div class="flex justify-center">
              <UIcon :name="feature.icon" class="w-12 h-12 text-red-500" />
            </div>
          </template>

          <h3 class="text-xl font-bold mt-4">{{ feature.title }}</h3>
          <p class="mt-2 text-gray-600">{{ feature.description }}</p>
        </UCard>
      </section>
    </main>

    <!-- ===================== Call To Action ===================== -->
    <footer class="bg-red-500 text-white text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Hungry? Let’s get started!</h2>
      <UButton size="lg" color="white" to="/login">Open Your E-Canteen Wallet</UButton>

      <p class="mt-6 text-sm opacity-80">
        © {{ new Date().getFullYear() }} Siena College Tigaon Inc. All rights reserved.
      </p>
    </footer>
  </div>
</template>
