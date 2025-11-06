<template>
  <v-app>
    <v-container class="pa-0" fluid style="background-color: #f6f6f6; min-height: 100vh;">
      <!-- Barre noire avec logo Uber Eats -->
      <v-app-bar color="black" elevation="0" height="56">
        <v-container>
          <v-btn class="mr-2" icon @click="$router.back()">
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>
          <img
            alt="Uber Eats"
            src="https://d3i4yxtzktqr9n.cloudfront.net/web-eats-v2/ee037aca86fd084a.svg"
            style="height: 24px; cursor: pointer;"
            @click="$router.push('/')"
          >
        </v-container>
      </v-app-bar>

      <!-- Contenu principal -->
      <v-main>
        <v-container class="d-flex justify-center align-center" style="min-height: calc(100vh - 56px); padding: 40px 20px;">
          <div style="max-width: 450px; width: 100%;">
            <h1 class="text-h5 font-weight-bold mb-2" style="color: #000; font-size: 28px !important;">
              Saisissez votre mot de passe
            </h1>

            <p class="text-body-2 text-grey-darken-1 mb-6">
              {{ email }}
            </p>

            <v-form ref="passwordForm" class="mt-6" @submit.prevent="handleLogin">
              <!-- Champ mot de passe -->
              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                bg-color="white"
                class="mb-4"
                density="comfortable"
                hide-details="auto"
                placeholder="Mot de passe"
                required
                :rules="passwordRules"
                style="border-radius: 4px;"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
              />

              <!-- Alert erreur -->
              <v-alert
                v-if="error"
                class="mb-4"
                closable
                density="compact"
                type="error"
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>

              <!-- Bouton Connexion -->
              <v-btn
                block
                class="mb-4 text-none"
                color="black"
                elevation="0"
                :loading="loading"
                size="x-large"
                style="border-radius: 500px; font-weight: 600; text-transform: none; letter-spacing: 0;"
                type="submit"
              >
                Connexion
              </v-btn>

              <div class="text-center">
                <v-btn class="text-none" style="color: #000; text-decoration: underline;" variant="text">
                  Mot de passe oublié ?
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-container>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuth } from '../composables/useAuth'
  import { authAPI } from '../services/api'

  const router = useRouter()
  const route = useRoute()
  const { login } = useAuth()
  const passwordForm = ref(null)

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loading = ref(false)
  const error = ref('')

  const passwordRules = [
    v => !!v || 'Le mot de passe est requis',
    v => v.length >= 6 || 'Au moins 6 caractères',
  ]

  onMounted(() => {
    email.value = route.query.email || ''
    if (!email.value) {
      router.push('/login')
    }
  })

  async function handleLogin () {
    const { valid } = await passwordForm.value.validate()
    if (!valid) return

    loading.value = true
    error.value = ''

    try {
      const response = await authAPI.login(email.value, password.value)

      if (response.data.success && response.data.data) {
        // Use composable to manage auth state
        login(response.data.data.user, response.data.data.token)
        router.push('/')
      }
    } catch (error_) {
      console.error('Login error:', error_)
      error.value = error_.response?.data?.message || 'Email ou mot de passe incorrect'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.v-field--variant-outlined .v-field__outline {
  border-radius: 4px;
}

.v-btn {
  font-family: 'Roboto', sans-serif !important;
}
</style>
